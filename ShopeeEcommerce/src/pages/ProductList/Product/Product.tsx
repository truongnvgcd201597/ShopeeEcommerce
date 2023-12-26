import { Link } from 'react-router-dom'
import ProductRating from 'src/components/ProductRating'
import path from 'src/constants/path'
import { Product as ProductItem } from 'src/types/product.types'
import { formatNumberToSocialStyle } from 'src/utils/utils'

interface Product {
  product: ProductItem
}
export default function Product({ product }: Product) {
  const { image, price, price_before_discount, name, sold, rating } = product
  return (
    <Link to={`${path.home}${product._id}`}>
      {' '}
      <div className='bg-white shadow rounded-sm hover:translate-y-[-0.04rem] hover:shadow-md duration-100 transition-transform overflow-hidden'>
        <div className='w-full pt-[100%] relative'>
          <img src={image} alt='' className='absolute top-0 left-0 bg-white w-full h-full object-cover' />
        </div>
        <div className='p-2 overflow-hidden'>
          <div className='min-h-[2rem] line-clamp-2 text-xs'>{name}</div>
          <div className='flex items-center mt-3'>
            <div className='line-through max-w-[50%] text-gray-500 truncate'>
              <span className='text-xs'>₫</span>
              <span>{price_before_discount}</span>
            </div>
            <div className='text-orange truncate ml-1'>
              <span className='text-xs'>₫</span>
              <span>{price}</span>
            </div>
          </div>
          <div className='mt-3 flex items-center justify-end'>
            <ProductRating rating={rating} />
            <div className='ml-2 text-sm'>
              <span>{formatNumberToSocialStyle(sold)}</span>
              <span className='ml-1'>Sold</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
