import Stripe from 'stripe'

export  const stripe = new Stripe(process.env.STRIPE_KEY!.trim(), {
  apiVersion: '2020-08-27'
})


