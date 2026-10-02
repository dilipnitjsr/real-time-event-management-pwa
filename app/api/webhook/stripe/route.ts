import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createOrder } from '@/lib/actions/order.actions'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !endpointSecret) {
    return NextResponse.json({ message: 'Webhook configuration error' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = Stripe.webhooks.constructEvent(body, signature, endpointSecret)
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

    const order = {
      stripeId: id,
      eventId: metadata.eventId,
      buyerId: metadata.buyerId,
      totalAmount: amount_total ? (amount_total / 100).toString() : '0',
      createdAt: new Date(),
    }

    await createOrder(order)
    return NextResponse.json({ message: 'OK' })
  }

  return new Response('', { status: 200 })
}
