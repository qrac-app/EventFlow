import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .unique()

    if (user) {
      await ctx.db.patch(user._id, {
        name: args.name,
        email: args.email,
        avatar: args.picture,
      })
      return user._id
    } else {
      return await ctx.db.insert('users', {
        name: args.name,
        email: args.email,
        avatar: args.picture,
        clerkId: args.clerkId,
      })
    }
  },
})

export const findUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .unique()

    return user ? {
      ...user,
      id: user._id,
    } : null
  },
})
