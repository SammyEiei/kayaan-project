import { useAuthStore } from '@/stores/auth'

// WebSocket Configuration
const WS_BASE_URL = import.meta.env.VITE_WS_ENDPOINT || 'ws://localhost:8080/ws'
const RECONNECT_INTERVAL = 5000 // 5 seconds
const MAX_RECONNECT_ATTEMPTS = 5

// WebSocket Event Types
export enum WebSocketEventType {
  // Connection events
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  RECONNECT = 'reconnect',

  // Group events
  GROUP_JOIN = 'group_join',
  GROUP_LEAVE = 'group_leave',
  GROUP_MESSAGE = 'group_message',
  GROUP_ACTIVITY = 'group_activity',

  // Notification events
  NOTIFICATION = 'notification',
  NOTIFICATION_READ = 'notification_read',

  // Content events
  CONTENT_CREATED = 'content_created',
  CONTENT_UPDATED = 'content_updated',
  CONTENT_DELETED = 'content_deleted',

  // Member events
  MEMBER_JOINED = 'member_joined',
  MEMBER_LEFT = 'member_left',
  MEMBER_ROLE_CHANGED = 'member_role_changed',

  // Error events
  ERROR = 'error',
  AUTH_ERROR = 'auth_error'
}

// WebSocket Message Interface
export interface WebSocketMessage {
  type: WebSocketEventType
  payload: any
  timestamp: string
  messageId?: string
}

// WebSocket Event Handler
export interface WebSocketEventHandler {
  (event: WebSocketEventType, payload: any): void
}

// WebSocket Connection State
export enum ConnectionState {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error'
}

// WebSocket Service Class
export class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private reconnectTimer: NodeJS.Timeout | null = null
  private eventHandlers: Map<WebSocketEventType, WebSocketEventHandler[]> = new Map()
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED
  private subscriptions: Set<string> = new Set()
  private heartbeatInterval: NodeJS.Timeout | null = null

  constructor() {
    this.setupEventHandlers()
  }

  // Connection Management
  async connect(): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return
    }

    try {
      this.setConnectionState(ConnectionState.CONNECTING)

      const authStore = useAuthStore()
      const token = authStore.token

      if (!token) {
        throw new Error('No authentication token available')
      }

      // Create WebSocket connection with authentication
      const wsUrl = `${WS_BASE_URL}?token=${token}`
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = this.handleOpen.bind(this)
      this.ws.onmessage = this.handleMessage.bind(this)
      this.ws.onclose = this.handleClose.bind(this)
      this.ws.onerror = this.handleError.bind(this)

    } catch (error) {
      console.error('WebSocket connection failed:', error)
      this.setConnectionState(ConnectionState.ERROR)
      this.scheduleReconnect()
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    this.setConnectionState(ConnectionState.DISCONNECTED)
    this.reconnectAttempts = 0
  }

  private handleOpen(): void {
    console.log('WebSocket connected successfully')
    this.setConnectionState(ConnectionState.CONNECTED)
    this.reconnectAttempts = 0

    // Start heartbeat
    this.startHeartbeat()

    // Resubscribe to previous subscriptions
    this.resubscribe()

    // Emit connect event
    this.emit(WebSocketEventType.CONNECT, { timestamp: new Date().toISOString() })
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data)
      this.handleWebSocketMessage(message)
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error)
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log('WebSocket disconnected:', event.code, event.reason)
    this.setConnectionState(ConnectionState.DISCONNECTED)

    // Stop heartbeat
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    // Emit disconnect event
    this.emit(WebSocketEventType.DISCONNECT, {
      code: event.code,
      reason: event.reason,
      timestamp: new Date().toISOString()
    })

    // Schedule reconnect if not manually closed
    if (event.code !== 1000) {
      this.scheduleReconnect()
    }
  }

  private handleError(error: Event): void {
    console.error('WebSocket error:', error)
    this.setConnectionState(ConnectionState.ERROR)

    // Emit error event
    this.emit(WebSocketEventType.ERROR, {
      error: error,
      timestamp: new Date().toISOString()
    })
  }

  // Message Handling
  private handleWebSocketMessage(message: WebSocketMessage): void {
    const { type, payload } = message

    // Handle system messages
    switch (type) {
      case WebSocketEventType.AUTH_ERROR:
        console.error('WebSocket authentication error:', payload)
        this.disconnect()
        // Redirect to login
        window.location.href = '/login'
        return

      case WebSocketEventType.ERROR:
        console.error('WebSocket error message:', payload)
        return
    }

    // Emit message to handlers
    this.emit(type, payload)
  }

  // Subscription Management
  subscribe(topic: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, cannot subscribe to:', topic)
      return
    }

    const subscribeMessage: WebSocketMessage = {
      type: WebSocketEventType.GROUP_JOIN,
      payload: { topic },
      timestamp: new Date().toISOString()
    }

    this.ws.send(JSON.stringify(subscribeMessage))
    this.subscriptions.add(topic)
  }

  unsubscribe(topic: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return
    }

    const unsubscribeMessage: WebSocketMessage = {
      type: WebSocketEventType.GROUP_LEAVE,
      payload: { topic },
      timestamp: new Date().toISOString()
    }

    this.ws.send(JSON.stringify(unsubscribeMessage))
    this.subscriptions.delete(topic)
  }

  private resubscribe(): void {
    this.subscriptions.forEach(topic => {
      this.subscribe(topic)
    })
  }

  // Message Sending
  send(type: WebSocketEventType, payload: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, cannot send message')
      return
    }

    const message: WebSocketMessage = {
      type,
      payload,
      timestamp: new Date().toISOString(),
      messageId: this.generateMessageId()
    }

    this.ws.send(JSON.stringify(message))
  }

  // Event Handling
  on(eventType: WebSocketEventType, handler: WebSocketEventHandler): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, [])
    }
    this.eventHandlers.get(eventType)!.push(handler)
  }

  off(eventType: WebSocketEventType, handler: WebSocketEventHandler): void {
    const handlers = this.eventHandlers.get(eventType)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  private emit(eventType: WebSocketEventType, payload: any): void {
    const handlers = this.eventHandlers.get(eventType)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(eventType, payload)
        } catch (error) {
          console.error('Error in WebSocket event handler:', error)
        }
      })
    }
  }

  // Utility Methods
  private setConnectionState(state: ConnectionState): void {
    this.connectionState = state
  }

  getConnectionState(): ConnectionState {
    return this.connectionState
  }

  isConnected(): boolean {
    return this.connectionState === ConnectionState.CONNECTED
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('Max reconnection attempts reached')
      this.setConnectionState(ConnectionState.ERROR)
      return
    }

    this.setConnectionState(ConnectionState.RECONNECTING)
    this.reconnectAttempts++

    const delay = RECONNECT_INTERVAL * Math.pow(2, this.reconnectAttempts - 1)

    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, delay)
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected()) {
        this.send(WebSocketEventType.CONNECT, { heartbeat: true })
      }
    }, 30000) // 30 seconds
  }

  private generateMessageId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  private setupEventHandlers(): void {
    // Default error handler
    this.on(WebSocketEventType.ERROR, (event, payload) => {
      console.error('WebSocket error:', payload)
    })

    // Default auth error handler
    this.on(WebSocketEventType.AUTH_ERROR, (event, payload) => {
      console.error('WebSocket authentication error:', payload)
      this.disconnect()
    })
  }
}

// Create singleton instance
export const websocketService = new WebSocketService()

// Export default instance
export default websocketService




