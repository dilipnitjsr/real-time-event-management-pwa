"use server"

import Stripe from 'stripe'
import { CheckoutOrderParams, GetOrdersByEventParams, GetOrdersByUserParams } from "@/types"
import { redirect } from 'next/navigation'
import { handleError } from '../utils'
import { connectToDatabase } from '../database'
import Order from '../database/models/order.model'
import Event from '../database/models/event.model'
import { ObjectId } from 'mongodb'
import User from '../database/models/user.model'
import { requireAuthenticatedUser } from '../auth'

export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const stripeSecret = process.env.STRIPE_SECRET_KEY
  if (!stripeSecret) throw new Error('STRIPE_SECRET_KEY is missing')

  const stripe = new Stripe(stripeSecret)
  const currentUser = await requireAuthenticatedUser()

  const event = await Event.findById(order.eventId)
  if (!event) throw new Error('Event not found')

  const price = event.isFree ? 0 : Number(event.price) * 100
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
  if (!serverUrl) throw new Error('NEXT_PUBLIC_SERVER_URL is missing')

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: price,
            product_data: {
              name: event.title,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        eventId: event._id.toString(),
        buyerId: currentUser._id.toString(),
      },
      mode: 'payment',
      success_url: `${serverUrl}/profile`,
      cancel_url: `${serverUrl}/`,
    })

    redirect(session.url!)
  } catch (error) {
    throw error
  }
}

// GET ORDERS BY EVENT
export async function getOrdersByEvent({ searchString, eventId }: GetOrdersByEventParams) {
  try {
    const currentUser = await requireAuthenticatedUser()

    if (!eventId) throw new Error('Event ID is required')
    const eventObjectId = new ObjectId(eventId)

    const event = await Event.findById(eventObjectId)
    if (!event || event.organizer.toString() !== currentUser._id.toString()) {
      throw new Error('Unauthorized or event not found')
    }

    const orders = await Order.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'buyer',
          foreignField: '_id',
          as: 'buyer',
        },
      },
      { $unwind: '$buyer' },
      {
        $lookup: {
          from: 'events',
          localField: 'event',
          foreignField: '_id',
          as: 'event',
        },
      },
      { $unwind: '$event' },
      {
        $project: {
          _id: 1,
          totalAmount: 1,
          createdAt: 1,
          eventTitle: '$event.title',
          eventId: '$event._id',
          buyer: {
            $concat: ['$buyer.firstName', ' ', '$buyer.lastName'],
          },
        },
      },
      {
        $match: {
          $and: [{ eventId: eventObjectId }, { buyer: { $regex: RegExp(searchString, 'i') } }],
        },
      },
    ])

    return JSON.parse(JSON.stringify(orders))
  } catch (error) {
    handleError(error)
  }
}

// GET ORDERS BY USER
export async function getOrdersByUser({ limit = 3, page }: GetOrdersByUserParams) {
  try {
    const currentUser = await requireAuthenticatedUser()

    const skipAmount = (Number(page) - 1) * limit
    const conditions = { buyer: currentUser._id.toString() }

    const orders = await Order.distinct('event._id')
      .find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: 'event',
        model: Event,
        populate: {
          path: 'organizer',
          model: User,
          select: '_id firstName lastName',
        },
      })

    const ordersCount = await Order.distinct('event._id').countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(orders)), totalPages: Math.ceil(ordersCount / limit) }
  } catch (error) {
    handleError(error)
  }
}
