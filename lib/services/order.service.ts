import { CreateOrderParams } from '@/types'
import { connectToDatabase } from '@/lib/database'
import Order from '@/lib/database/models/order.model'

export async function createOrderFromVerifiedWebhook(order: CreateOrderParams) {
  await connectToDatabase()

  const newOrder = await Order.create({
    ...order,
    event: order.eventId,
    buyer: order.buyerId,
  })

  return JSON.parse(JSON.stringify(newOrder))
}
