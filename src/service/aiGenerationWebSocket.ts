import { useAIGenerationStore } from '@/stores/aiGeneration'

/**
 * WebSocket service for real-time AI generation updates
 * Handles connection, reconnection, and message processing
 */
export class AIGenerationWebSocket {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private token: string | null = null
  private isConnecting = false
  private messageHandlers: Map<string, (data: any) => void> = new Map()

  constructor() {
    this.setupMessageHandlers()
  }

  /**
   * Connect to WebSocket server
   */
  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnecting) {
        reject(new Error('Connection already in progress'))
        return
      }

      this.token = token
      this.isConnecting = true

      try {
        this.ws = new WebSocket(`ws://localhost:8080/ws/ai-generation?token=${token}`)

        this.ws.onopen = () => {
          console.log('WebSocket connected to AI generation service')
          this.reconnectAttempts = 0
          this.isConnecting = false
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            this.handleMessage(data)
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason)
          this.isConnecting = false

          if (event.code !== 1000) { // Not a normal closure
            this.attemptReconnect()
          }
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          this.isConnecting = false
          reject(error)
        }

        // Set connection timeout
        setTimeout(() => {
          if (this.isConnecting) {
            this.isConnecting = false
            reject(new Error('WebSocket connection timeout'))
          }
        }, 10000)

      } catch (error) {
        this.isConnecting = false
        reject(error)
      }
    })
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }
    this.isConnecting = false
  }

  /**
   * Send message to WebSocket server
   */
  send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected, cannot send message')
    }
  }

  /**
   * Subscribe to generation updates for a specific request
   */
  subscribeToGeneration(requestId: number): void {
    this.send({
      type: 'SUBSCRIBE_GENERATION',
      requestId: requestId
    })
  }

  /**
   * Unsubscribe from generation updates
   */
  unsubscribeFromGeneration(requestId: number): void {
    this.send({
      type: 'UNSUBSCRIBE_GENERATION',
      requestId: requestId
    })
  }

  /**
   * Setup message handlers for different message types
   */
  private setupMessageHandlers(): void {
    this.messageHandlers.set('GENERATION_PROGRESS', (data) => {
      const aiGenerationStore = useAIGenerationStore()
      aiGenerationStore.updateRequestProgress(data.requestId, data.progress)
    })

    this.messageHandlers.set('GENERATION_COMPLETED', (data) => {
      const aiGenerationStore = useAIGenerationStore()
      aiGenerationStore.updateRequestStatus(data.requestId, {
        status: 'COMPLETED',
        progress: 100,
        completedAt: new Date().toISOString()
      })
    })

    this.messageHandlers.set('GENERATION_FAILED', (data) => {
      const aiGenerationStore = useAIGenerationStore()
      aiGenerationStore.updateRequestStatus(data.requestId, {
        status: 'FAILED',
        errorMessage: data.errorMessage
      })
    })

    this.messageHandlers.set('GENERATION_STARTED', (data) => {
      const aiGenerationStore = useAIGenerationStore()
      aiGenerationStore.updateRequestStatus(data.requestId, {
        status: 'PROCESSING',
        startedAt: new Date().toISOString()
      })
    })

    this.messageHandlers.set('RATE_LIMIT_WARNING', (data) => {
      console.warn('Rate limit warning:', data.message)
      // You can emit a custom event here for UI notification
      window.dispatchEvent(new CustomEvent('rate-limit-warning', {
        detail: data
      }))
    })

    this.messageHandlers.set('SYSTEM_MESSAGE', (data) => {
      console.log('System message:', data.message)
    })

    this.messageHandlers.set('PONG', (data) => {
      console.log('Received pong from server')
    })
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(data: any): void {
    const handler = this.messageHandlers.get(data.type)

    if (handler) {
      handler(data)
    } else {
      console.warn('Unknown message type:', data.type)
    }
  }

  /**
   * Attempt to reconnect to WebSocket server
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts || !this.token) {
      console.error('Max reconnection attempts reached or no token available')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * this.reconnectAttempts

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

    setTimeout(() => {
      if (this.token) {
        this.connect(this.token).catch(error => {
          console.error('Reconnection failed:', error)
        })
      }
    }, delay)
  }

  /**
   * Send ping to keep connection alive
   */
  ping(): void {
    this.send({ type: 'PING' })
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'DISCONNECTED' {
    if (!this.ws) {
      return 'DISCONNECTED'
    }

    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING'
      case WebSocket.OPEN:
        return 'OPEN'
      case WebSocket.CLOSING:
        return 'CLOSING'
      case WebSocket.CLOSED:
        return 'CLOSED'
      default:
        return 'DISCONNECTED'
    }
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  /**
   * Get reconnection info
   */
  getReconnectionInfo(): {
    attempts: number
    maxAttempts: number
    isConnecting: boolean
  } {
    return {
      attempts: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts,
      isConnecting: this.isConnecting
    }
  }
}

// Export singleton instance
export const aiGenerationWebSocket = new AIGenerationWebSocket()
