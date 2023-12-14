import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface InputProps {
  type: React.HTMLInputTypeAttribute
  placeHolder?: string
  errorMessage?: string
  className?: string
  name?: string
  register?: UseFormRegister<any>
  rules?: RegisterOptions
  autoComplete?: string
}
export default function Input({
  type,
  placeHolder,
  errorMessage,
  className,
  name,
  register,
  rules,
  autoComplete
}: InputProps) {
  return (
    <div className={className}>
      <input
        type={type}
        className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
        placeholder={placeHolder}
        {...register?.(name || '', rules)}
        autoComplete={autoComplete}
      />
      <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errorMessage}</div>
    </div>
  )
}
