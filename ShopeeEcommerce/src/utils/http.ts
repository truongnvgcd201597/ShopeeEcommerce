import axios, { AxiosError, AxiosInstance } from 'axios'
import httpStatusCode from 'src/constants/constant.httpStatusCode'
import { toast } from 'react-toastify'
import { AuthResponse } from 'src/types/auth.types'
import { clearLocalStorage, getAccessTokenFromLocalStorage, saveAccessTokenToLocalStorage, setProfile } from './auth'
import path from 'src/constants/path'

class Http {
  instance: AxiosInstance
  private accessToken: string = ''

  constructor() {
    this.accessToken = getAccessTokenFromLocalStorage()
    ;(this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })),
      // Add a response interceptor
      this.instance.interceptors.response.use(
        (response) => {
          const { url } = response.config
          if (url === path.login || url === path.register) {
            const data = response.data as AuthResponse
            this.accessToken = (data as AuthResponse).data?.access_token
            saveAccessTokenToLocalStorage(this.accessToken)
            setProfile(data.data.user)
          } else if (url === path.logout) {
            clearLocalStorage()
          }

          return response
        },
        (error: AxiosError) => {
          if (error.status !== httpStatusCode.UnprocessableEntity) {
            const message = (error.response?.data as any | undefined)?.message

            toast.error(message) // Show toast error message
          }
          if (error.status === httpStatusCode.Unauthorized) {
            clearLocalStorage()
            window.location.reload()
          }

          return Promise.reject(error)
        }
      )
    // Add a request interceptor
    this.instance.interceptors.request.use((config) => {
      if (this.accessToken && config.headers) {
        config.headers.Authorization = this.accessToken
        return config
      }
      return config
    }),
      (error: AxiosError) => {
        return Promise.reject(error)
      }
  }
}

const http = new Http().instance

export default http
