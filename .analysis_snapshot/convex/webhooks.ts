import { api } from './_generated/api'
import { httpAction } from './_generated/server'

export const clerkWebhook = httpAction(async (ctx, request) => {
  const payload = await request.json()

  console.log('Received Clerk webhook:', payload)

  if (payload.type === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = payload.data
    
    await ctx.runMutation(api.users.createUser, {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name} ${last_name}`,
      picture: image_url,
    })
  }
  return new Response(null, { status: 200 })
})