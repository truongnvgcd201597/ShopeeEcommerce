import { omit } from 'lodash'
import useQueryConfig from './useQueryConfig'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Schema, schema } from 'src/utils/rules'

export default function useSearchProduct() {
  const queryConfig = useQueryConfig()
  const navigate = useNavigate()

  const nameSchema = schema.pick(['name'])
  type FormData = Pick<Schema, 'name'>

  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  })

  const onSubmitSearch = handleSubmit((data) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: data.name
          },
          ['order', 'sort_by']
        )
      : {
          ...queryConfig,
          name: data.name
        }
    navigate({
      pathname: path.home,
      search: createSearchParams(config).toString()
    })
  })
  return { onSubmitSearch, register }
}
