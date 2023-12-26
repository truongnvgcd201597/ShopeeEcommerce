import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'

type Rules = {
  [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions
}

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_max, price_min } = this.parent as { price_min: string; price_max: string }
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }
  return price_min !== '' || price_max !== ''
}

export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: 'Enter your email address'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email không đúng định dạng'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 5 - 160 ký tự'
    },
    minLength: {
      value: 5,
      message: 'Độ dài từ 5 - 160 ký tự'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Enter your password'
    },
    minLength: {
      value: 6,
      message: 'Minimum length is 5'
    },
    maxLength: {
      value: 160,
      message: 'Maximum length is 160'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Enter your confirm password'
    },
    minLength: {
      value: 6,
      message: 'Minimum length is 5'
    },
    maxLength: {
      value: 160,
      message: 'Maximum length is 160'
    },
    validate:
      typeof getValues === 'function' ? (value) => value === getValues || 'Confirm password does not match' : undefined
  }
})

export const schema = yup.object({
  email: yup
    .string()
    .required('Enter your email address')
    .email('must be a valid email')
    .min(5, 'Minimum length is 5')
    .max(150, 'Maximum length is 150'),
  password: yup
    .string()
    .required('Enter your password')
    .min(6, 'Minimum length is 6')
    .max(160, 'Maximum length is 160'),
  confirm_password: yup
    .string()
    .required('Enter your confirm password')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
    .oneOf([yup.ref('password')], 'Confirm password does not match'),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  })
})

const loginSchema = schema.omit(['confirm_password'])

export type Schema = yup.InferType<typeof schema>
export type LoginSchema = yup.InferType<typeof loginSchema>
