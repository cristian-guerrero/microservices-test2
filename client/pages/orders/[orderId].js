import StripeCheckout from 'react-stripe-checkout'

import {useEffect, useState} from 'react'

import useRequest from '../../hooks/use-request'

const OrderShow = ({order, currentUser}) => {

  const [timeLeft, setTimeLeft] = useState(0)

  const {doRequest, errors} = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: payment => console.log(payment)
  })

  //console.log(order)

  useEffect(() => {

    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()

      setTimeLeft(Math.round(msLeft / 1000))
    }

    //first call, first second
    findTimeLeft()
    const timerId = setInterval(findTimeLeft, 1000)

    // useEffect does return when we are about to navigate away from this component or if the component is going to be re rendered
    // return is only called if we pass the second argument to useEffect, in this case is an empty array ([])
    return () => {
      clearInterval(timerId)
    }
  }, [])


  if (timeLeft < 0) {
    return <div>Order expired</div>
  }

  return (<div>
    Time left to pay: {timeLeft} seconds
    <StripeCheckout token={token => doRequest({token: token.id})}
                    stripeKey='pk_test_51Hxy6vH5RgEaYNEwd7d9Dn5VxwzePK28RGOB36RH1fxgfZiSYUGokHpObwR7vRgHJWcWg373IDnsygdtiTXxqNvm00Mw5KWAIz'
                    amount={order.ticket.price * 100}
                    email={currentUser.email}
    />
    {errors}
  </div>)
}


OrderShow.getInitialProps = async (context, client) => {
  const {orderId} = context.query
  const {data} = await client.get(`/api/orders/${orderId}`)

  return {order: data}
}
export default OrderShow
