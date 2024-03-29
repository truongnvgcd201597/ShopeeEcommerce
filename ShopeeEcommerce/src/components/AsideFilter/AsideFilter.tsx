import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import path from 'src/constants/path'
import { Category } from 'src/types/category.types'
import classNames from 'classnames'
import { useForm } from 'react-hook-form'
import { Schema, schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { NoUndefined } from 'src/types/utils.types'
import RatingStars from 'src/components/RatingStars'
import omit from 'lodash/omit'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import InputVerTwo from '../InputVersusTwo'
import { useTranslation } from 'react-i18next'

interface AsideFilterProps {
  queryConfig: QueryConfig
  categories: Category[]
}

type FormData = NoUndefined<Pick<Schema, 'price_min' | 'price_max'>>
export default function AsideFilter({ queryConfig, categories }: AsideFilterProps) {
  const { category } = queryConfig

  const navigate = useNavigate()
  const { t } = useTranslation()

  const caterogiesSchema = schema.pick(['price_min', 'price_max'])
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(caterogiesSchema),
    shouldFocusError: false
  })

  const onSubmit = handleSubmit(
    (data) => {
      navigate({
        pathname: path.home,
        search: createSearchParams({
          ...queryConfig,
          ...data
        }).toString()
      })
    },
    (error) => {
      error.price_max?.ref?.focus()
    }
  )

  const handleRemoveAll = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'rating_filter', 'category'])).toString()
    })
  }
  return (
    <div className='py-4'>
      <Link
        to={path.home}
        className={classNames('flex items-center font-bold', {
          'text-orange': !category
        })}
      >
        <svg viewBox='0 0 12 10' className='w-3 h-4 mr-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        {t('aside filter.All Categories')}
      </Link>
      <div className='bg-gray-300 h-[1px] my-4' />
      <ul>
        {categories.map((categoryItem) => {
          const isActive = category === categoryItem._id
          return (
            <li className='py-2 pl-2' key={categoryItem._id}>
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem._id
                  }).toString()
                }}
                className={classNames('relative px-2', {
                  'font-semibold text-orange': isActive
                })}
              >
                {isActive && (
                  <svg viewBox='0 0 4 7' className='absolute top-1 left-[-10px] h-2 w-2 fill-orange'>
                    <polygon points='4 3.5 0 0 0 7' />
                  </svg>
                )}
                {categoryItem.name}
              </Link>
            </li>
          )
        })}
      </ul>
      <Link to={path.home} className='flex items-center font-bold mt-4 uppercase'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='w-3 h-4 fill-current stroke-current mr-3'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        {t('Search Filter')}
      </Link>
      <div className='bg-gray-300 h-[1px] my-4' />
      <div className='my-5'>
        <div>Price range</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <InputVerTwo
              control={control}
              name='price_min'
              type='number'
              className='grow'
              placeholder='₫ TO'
              classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
              classNameError='hidden'
              onChange={() => {
                trigger('price_max')
              }}
            />
            <div className='mx-2 mt-2 shrink-0'>-</div>
            <InputVerTwo
              control={control}
              name='price_max'
              type='number'
              className='grow'
              placeholder='₫ TO'
              classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
              classNameError='hidden'
              onChange={() => {
                trigger('price_max')
              }}
            />
          </div>
          <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm text-center'>
            {errors.price_min?.message || errors.price_max?.message}
          </div>
          <Button className='w-full p-2 uppercase bg-orange text-white text-sm hover:bg-orange/80 flex justify-center items-center'>
            Apply
          </Button>
        </form>
      </div>
      <div className='bg-gray-300 h-[1px] my-4' />
      <div className='text-sm'>Đánh giá</div>
      <RatingStars queryConfig={queryConfig} />
      <div className='bg-gray-300 h-[1px] my-4' />
      <Button
        onClick={handleRemoveAll}
        className='w-full p-2 uppercase bg-orange text-white text-sm hover:bg-orange/80 flex justify-center items-center'
      >
        Delete all
      </Button>
    </div>
  )
}
