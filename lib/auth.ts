import { auth } from '@clerk/nextjs'

import { connectToDatabase } from '@/lib/database'
import User from '@/lib/database/models/user.model'

export async function requireAuthenticatedUser() {
  const { userId: clerkId } = auth()

  if (!clerkId) {
    throw new Error('Unauthorized')
  }

  await connectToDatabase()

  const user = await User.findOne({ clerkId })

  if (!user) {
    throw new Error('Authenticated user is not provisioned in the application database')
  }

  return user
}
