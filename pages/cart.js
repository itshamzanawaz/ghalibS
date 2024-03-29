import * as React from 'react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCart } from 'react-use-cart'
import { loadStripe } from '@stripe/stripe-js'
import {Modal} from 'antd'
import Button from '@/components/ui/button'
import {
  ChevronDownSmallIcon,
  ChevronUpSmallIcon,
  XSmallIcon
} from '@/components/icons'
import { formatCurrencyValue } from '@/utils/format-currency-value'
import getPageData from '@/lib/get-page-data'
import SEO from '@/components/seo'
import { useSettingsContext } from '@/context/settings'
import useSubmissionState from 'hooks/use-form-submission'
import CheckOutForm from '@/components/CheckoutForm'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

function Cart() {
  const [modal , setModal] = useState(false);
  const {
    cartTotal,
    isEmpty,
    items,
    removeItem,
    updateItemQuantity
  } = useCart()
  const router = useRouter()
  const { activeCurrency } = useSettingsContext()
  const {
    setSubmissionError,
    setSubmissionLoading,
    submissionError,
    submissionLoading,
    submissionState
  } = useSubmissionState()

  const decrementItemQuantity = (item) =>
    updateItemQuantity(item.id, item.quantity - 1)

  const incrementItemQuantity = (item) =>
    updateItemQuantity(item.id, item.quantity + 1)

  const handleClick = () => {
    setModal(true)
  }

  if (isEmpty) return <p>Your cart is empty</p>
  console.log(items,cartTotal,"aaaa")
  return (
    <>
    
     <Modal
        title="Checout Form"
        open={modal}
        onCancel={() => setModal(false)}
        footer={null}
      >
    <CheckOutForm items={items} setModal={modal} cartTotal={cartTotal}/>

      </Modal>
    <React.Fragment>
      <SEO title="Cart" />
      {items.map((item) => {
        return (
          
          <div
            className="md:bg-gray-50 md:rounded-lg flex items-center py-3 md:py-6 md:px-6 md:mb-3"
            key={item.id}
          >

            <div className="w-3/5 flex flex-grow items-center">
              <div className="h-16 md:h-20 w-16 md:w-20 mr-4 bg-gray-50 p-1 rounded-lg">
                <Image
                  src={item.image.url}
                  width={item.image.width}
                  height={item.image.height}
                />
              </div>
              <div>
                <Link href={`/products/${item[router.locale].slug}`} className="text-gray-800 font-medium text-sm md:text-base">
                  {item[router.locale].name}
                </Link>
                <button
                  className="text-gray-400 hover:text-indigo-600 text-xs flex items-center focus:outline-none"
                  onClick={() => removeItem(item.id)}
                  disabled={submissionLoading}
                >
                  <XSmallIcon className="h-3 w-3" />
                  Remove
                </button>
              </div>
            </div>
            <div className="hidden md:flex flex-col items-center ml-auto">
              <button
                className="text-gray-400 hover:text-indigo-600 focus:outline-none p-1"
                onClick={() => incrementItemQuantity(item)}
                disabled={submissionLoading}
              >
                <ChevronUpSmallIcon className="h-4 w-4" />
              </button>
              <span className="mx-3 md:mx-6 p-1">{item.quantity}</span>
              <button
                className="text-gray-400 hover:text-indigo-600 focus:outline-none p-1"
                onClick={() => decrementItemQuantity(item)}
                disabled={submissionLoading}
              >
                <ChevronDownSmallIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="text-right md:w-1/5">
              <p className="font-medium text-gray-800">
                {formatCurrencyValue({
                  currency: activeCurrency,
                  value: item.itemTotal
                })}
              </p>
              {item.quantity > 1 && (
                <p className="text-gray-400 text-sm">
                  {formatCurrencyValue({
                    currency: activeCurrency,
                    value: item.price
                  })}{' '}
                  each
                </p>
              )}
            </div>
          </div>
        )
      })}
      <div className="mt-3 md:mt-6 py-3 md:py-6 border-t-2 border-gray-50">
        <div className="flex flex-col items-end">
          <div className="flex flex-col items-end mb-3">
            <span className="text-gray-700">Sub total</span>
            <span className="text-xl font-bold text-indigo-600">
              {formatCurrencyValue({
                currency: activeCurrency,
                value: cartTotal
              })}
            </span>
          </div>
          <Button onClick={handleClick} disabled={submissionLoading}>
            Checkout
          </Button>
        </div>
      </div>
    </React.Fragment>
    </>
  )
}

export async function getStaticProps({ locale }) {
  const pageData = await getPageData({ locale })

  return {
    props: {
      ...pageData
    }
  }
}

export default Cart
