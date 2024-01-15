import { User } from 'src/types/users.types'

export const saveAccessTokenToLocalStorage = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken)
}

export const saveRefreshTokenToLocalStorage = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken)
}

export const localStorageEventTarget = new EventTarget()

export const clearLocalStorage = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('profile')
  const clearLocalStorageEvent = new Event('clearLocalStorage')
  localStorageEventTarget.dispatchEvent(clearLocalStorageEvent)
}

export const clearRefreshToken = () => {
  localStorage.removeItem('refreshToken')
}

export const getAccessTokenFromLocalStorage = () => {
  return localStorage.getItem('accessToken') || ''
}

export const getRefreshTokenFromLocalStorage = () => {
  return localStorage.getItem('refreshToken') || ''
}

export const getProfile = () => {
  const result = localStorage.getItem('profile') as string
  return result ? JSON.parse(result) : null
}

export const setProfile = (profile: User) => {
  const result = JSON.stringify(profile)
  return localStorage.setItem('profile', result)
}
