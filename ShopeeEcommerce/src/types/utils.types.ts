export interface ErrorResponseApi<Data> {
  message: string
  data?: Data
}

export interface SuccessResponseApi<Data> {
  message: string
  data: Data
}

export type NoUndefined<T> = {
  [P in keyof T]-?: NoUndefined<NonNullable<T[P]>>
}
