import Stripe from 'stripe'
import { NextResponse } from 'next/server'

import { createOrderFromVerifiedWebhook } from '@/lib/services/order.service'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY

  if (!signature || !endpointSecret || !stripeSecretKey) {
    return NextResponse.json({ message: 'Webhook configuration error' }, { status: 500 })
  }

  const stripe = new Stripe(stripeSecretKey)
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch {
    console.warn('Rejected invalid Stripe webhook signature')
    return NextResponse.json({ message: 'Invalid webhook signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { id, amount_total, metadata } = session

    if (!metadata?.eventId || !metadata?.buyerId) {
      return NextResponse.json({ message: 'Missing order metadata' }, { status: 400 })
    }

    await createOrderFromVerifiedWebhook({
      stripeId: id,
      eventId: metadata.eventId,
      buyerId: metadata.buyerId,
      totalAmount: amount_total ? (amount_total / 100).toString() : '0',
      createdAt: new Date(),
    })

    return NextResponse.json({ message: 'OK' })
  }

  return new Response('', { status: 200 })
}
