export interface User {
  id: number
  username: string
  email: string
  roles: string[]
  firstname: string
  lastname: string
  password: string //add password
  avatarUrl?: string
  avatarRotation?: number
}
