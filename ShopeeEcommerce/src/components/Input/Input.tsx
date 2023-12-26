import { InputHTMLAttributes } from 'react'
import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  register?: UseFormRegister<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: RegisterOptions
}
export default function Input({
  autoComplete,
  type,
  name,
  register,
  errorMessage,
  className,
  rules,
  classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
  classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
  ...rest
}: InputProps) {
  const registerResult = register && name ? register(name, rules) : {}
  return (
    <div className={className}>
      <input type={type} className={classNameInput} autoComplete={autoComplete} {...registerResult} {...rest} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}
