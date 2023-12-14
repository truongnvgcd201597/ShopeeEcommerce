import { User } from './users.types'
import { SuccessResponseApi } from './utils.types'

export type AuthResponse = SuccessResponseApi<{
  access_token: string
  expires: string
  user: User
}>
