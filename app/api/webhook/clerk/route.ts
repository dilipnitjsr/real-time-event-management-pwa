import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.actions'
import { clerkClient } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const webhookSecret = process.env.WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('WEBHOOK_SECRET is not configured')
    return new Response('Webhook configuration error', { status: 500 })
  }

  const headerPayload = headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing webhook verification headers', { status: 400 })
  }

  const body = await req.text()
  const wh = new Webhook(webhookSecret)

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent
  } catch {
    console.warn('Rejected invalid Clerk webhook signature')
    return new Response('Invalid webhook signature', { status: 400 })
  }

  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, image_url, first_name, last_name, username } = evt.data

    const primaryEmail = email_addresses[0]?.email_address
    if (!primaryEmail || !username) {
      return new Response('Required user fields are missing', { status: 400 })
    }

    const user = {
      clerkId: id,
      email: primaryEmail,
      username,
      firstName: first_name,
      lastName: last_name,
      photo: image_url,
    }

    const newUser = await createUser(user)

    if (newUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id,
        },
      })
    }

    return NextResponse.json({ message: 'OK' })
  }

  if (eventType === 'user.updated') {
    const { id, image_url, first_name, last_name, username } = evt.data

    if (!username) {
      return new Response('Required user fields are missing', { status: 400 })
    }

    await updateUser(id, {
      firstName: first_name,
      lastName: last_name,
      username,
      photo: image_url,
    })

    return NextResponse.json({ message: 'OK' })
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data
    if (id) await deleteUser(id)

    return NextResponse.json({ message: 'OK' })
  }

  return new Response('', { status: 200 })
}
