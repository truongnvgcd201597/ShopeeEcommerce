import { User } from './users.types'
import { SuccessResponseApi } from './utils.types'

export type AuthResponse = SuccessResponseApi<{
  access_token: string
  refresh_token: string
  'expire-refresh-token': number
  expires: number
  user: User
}>

export type RefreshTokenResponse = SuccessResponseApi<{
  access_token: string
}>
