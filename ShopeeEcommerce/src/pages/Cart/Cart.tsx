import { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Link, useLocation } from 'react-router-dom'
import purchaseApi from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import { purchaseStatus } from 'src/constants/purchases'
import { AppContext } from 'src/contexts/app.context'
import { ExtendedPurchase } from 'src/types/purchase.types'
import { formatCurrency } from 'src/utils/utils'
import { produce } from 'immer'
import { keyBy } from 'lodash'
import { toast } from 'react-toastify'

export default function Cart() {
  const { isAuthenticated, extendedPurchases, setExtendedPurchases } = useContext(AppContext)
  const [buyCount, setBuyCount] = useState(1)
  const checkedPurchases = extendedPurchases.filter((purchase) => purchase.checked)
  const location = useLocation()

  const choosenPurchaseIdFromLocation = (location.state as { purchaseId: string } | null)?.purchaseId
  console.log(choosenPurchaseIdFromLocation)

  const handleBuyCountChange = (value: number) => {
    setBuyCount(value)
  }

  const { data: purchaseInCartData, refetch } = useQuery({
    queryKey: ['purchase', { status: purchaseStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchaseStatus.inCart }),
    enabled: isAuthenticated
  })

  const data = purchaseInCartData?.data.data

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  const buyProductMutation = useMutation({
    mutationFn: purchaseApi.buyPurchase,
    onSuccess: (data) => {
      refetch()
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
  })

  const deletePurchaseMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id')
      return (
        data?.map((purchase) => {
          const isChoosenPurchaseFromLocation = choosenPurchaseIdFromLocation === purchase._id
          return {
            ...purchase,
            disabled: false,
            checked: isChoosenPurchaseFromLocation || Boolean(extendedPurchasesObject[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [purchaseInCartData, choosenPurchaseIdFromLocation])

  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  const handleQuantity = (purchaseIndex: number, value: number, enabled: boolean) => {
    if (enabled) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft: ExtendedPurchase[]) => {
          draft[purchaseIndex].disabled = true
        })
      )
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }

  const handleChecked = (purchaseIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft: ExtendedPurchase[]) => {
        draft[purchaseIndex].checked = e.target.checked
      })
    )
  }

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    const purchase = extendedPurchases[purchaseIndex]
    setExtendedPurchases(
      produce((draft: ExtendedPurchase[]) => {
        draft[purchaseIndex].disabled = true
      })
    )
    updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
  }

  const handleCheckedAll = () => {
    setExtendedPurchases((prev) => prev.map((purchase) => ({ ...purchase, checked: !isAllChecked })))
  }

  const handleDeletePurchase = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id
    deletePurchaseMutation.mutate([purchaseId])
  }

  const handleDeleteManyPurchases = () => {
    const checkedPurchasesIdx = checkedPurchases.map((purchase) => purchase._id)
    deletePurchaseMutation.mutate(checkedPurchasesIdx)
  }

  const totalCheckedPurchase = () => {
    const totalCheckedPrice = checkedPurchases
      .map((purchase) => purchase.price * purchase.buy_count)
      .reduce((a, b) => a + b, 0)
    return totalCheckedPrice
  }

  const totalCheckedSavingPrice = () => {
    return checkedPurchases.reduce((result, current) => {
      return result + (current.product.price_before_discount - current.product.price) * current.buy_count
    }, 0)
  }

  const handleBuyPurchase = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyProductMutation.mutate(body)
    }
  }

  const isAllChecked = extendedPurchases.every((purchase) => purchase.checked)
  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        <div className='overflow-auto'>
          <div className='min-w-[1000px]'>
            <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
              <div className='col-span-6'>
                <div className='flex items-center'>
                  <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                    <input
                      type='checkbox'
                      className='h-5 w-5 accent-orange'
                      onChange={handleCheckedAll}
                      checked={isAllChecked}
                    />
                  </div>
                  <div className='flex-grow text-black'>Product</div>
                </div>
              </div>
              <div className='col-span-6'>
                <div className='grid grid-cols-5 text-center'>
                  <div className='col-span-2'>Unit Price</div>
                  <div className='col-span-1'>Quantity</div>
                  <div className='col-span-1'>Amount</div>
                  <div className='col-span-1'>Action</div>
                </div>
              </div>
            </div>
            {extendedPurchases.length > 0 && (
              <div className='my-3 rounded-sm bg-white p-5 shadow'>
                {extendedPurchases?.map((purchase, index) => (
                  <div
                    key={purchase._id}
                    className='mb-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white py-5 px-4 text-center text-sm text-gray-500 first:mt-0'
                  >
                    <div className='col-span-6'>
                      <div className='flex'>
                        <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                          <input
                            type='checkbox'
                            className='h-5 w-5 accent-orange'
                            checked={purchase.checked as boolean}
                            onChange={handleChecked(index)}
                          />
                        </div>
                        <div className='flex-grow'>
                          <div className='flex'>
                            <Link className='h-20 w-20 flex-shrink-0' to=''>
                              <img alt={purchase.product.name} src={purchase.product.image} />
                            </Link>
                            <div className='flex-grow px-2 pt-1 pb-2'>
                              <Link to={`${path.home}${purchase.product._id}`} className='line-clamp-2'>
                                {purchase.product.name}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-span-6'>
                      <div className='grid grid-cols-5 items-center'>
                        <div className='col-span-2'>
                          <div className='flex items-center justify-center'>
                            <span className='text-gray-300 line-through'>đ{formatCurrency(purchase.price)}</span>
                            <span className='ml-3'>đ{formatCurrency(purchase.price)}</span>
                          </div>
                        </div>
                        <div className='col-span-1'>
                          <QuantityController
                            onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                            onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                            max={purchase.product.quantity}
                            value={purchase.buy_count}
                            disabled={purchase.disabled}
                            classNameWrapper='flex items-center'
                            onType={(value) => handleTypeQuantity(index)}
                            onFocusLeave={(value) =>
                              handleQuantity(index, value, value >= 1 && value <= purchase.product.quantity)
                            }
                          />
                        </div>
                        <div className='col-span-1'>
                          <span className='text-orange'>đ{formatCurrency(purchase.price * purchase.buy_count)}</span>
                        </div>
                        <div className='col-span-1'>
                          <button
                            className='bg-none text-black transition-colors hover:text-orange'
                            onClick={handleDeletePurchase(index)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className='sticky bottom-0 z-10 mt-8 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center'>
          <div className='flex items-center'>
            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
              <input
                type='checkbox'
                className='h-5 w-5 accent-orange'
                checked={isAllChecked}
                onChange={handleCheckedAll}
              />
            </div>
            <button className='mx-3 border-none bg-none'>Select all</button>
            <button onClick={handleDeleteManyPurchases} className='mx-3 border-none bg-none'>
              Delete
            </button>
          </div>

          <div className='mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
            <div>
              <div className='flex items-center sm:justify-end'>
                <div>Total payment ({checkedPurchases.length} products):</div>
                <div className='ml-2 text-2xl text-orange'>{formatCurrency(totalCheckedPurchase())}</div>
              </div>
              <div className='flex items-center text-sm sm:justify-end'>
                <div className='text-gray-500'>Save</div>
                <div className='ml-6 text-orange'>đ{formatCurrency(totalCheckedSavingPrice())}</div>
              </div>
            </div>
            <Button
              className='mt-5 flex h-10 w-52 items-center justify-center bg-red-500 text-sm uppercase text-white hover:bg-red-600 sm:ml-4 sm:mt-0'
              onClick={handleBuyPurchase}
              disabled={buyProductMutation.isLoading}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
