import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const getCurrentUserAsParticipant = query({
  args: {
    eventId: v.id('events'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return null
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()

    if (!user) {
      return null
    }

    return await ctx.db
      .query('participants')
      .withIndex('by_user_and_event', (q) =>
        q.eq('userId', user._id).eq('eventId', args.eventId),
      )
      .unique()
  },
})

export const addParticipant = mutation({
  args: {
    eventId: v.id('events'),
    participantId: v.id('users'),
    role: v.union(v.literal('editor'), v.literal('viewer')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Not authenticated')
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()

    if (!user) {
      throw new Error('User not found')
    }

    const event = await ctx.db.get(args.eventId)
    if (!event) {
      throw new Error('Event not found')
    }

    const participant = await ctx.db
      .query('participants')
      .withIndex('by_user_and_event', (q) =>
        q.eq('userId', user._id).eq('eventId', args.eventId),
      )
      .unique()

    if (!participant || (participant.role !== 'owner' && participant.role !== 'editor')) {
      throw new Error('Not authorized to add participants to this event')
    }

    const existingParticipant = await ctx.db
      .query('participants')
      .withIndex('by_user_and_event', (q) =>
        q.eq('userId', args.participantId).eq('eventId', args.eventId),
      )
      .unique()

    if (existingParticipant) {
      // User is already a participant
      return
    }

    await ctx.db.insert('participants', {
      userId: args.participantId,
      eventId: args.eventId,
      role: args.role,
    })
  },
})

export const removeParticipant = mutation({
  args: {
    eventId: v.id('events'),
    participantId: v.id('participants'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Not authenticated')
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()

    if (!user) {
      throw new Error('User not found')
    }

    const event = await ctx.db.get(args.eventId)
    if (!event) {
      throw new Error('Event not found')
    }

    if (event.ownerId !== user._id) {
      throw new Error('Not authorized to remove participants from this event')
    }

    const participant = await ctx.db.get(args.participantId)

    if (participant) {
      await ctx.db.delete(participant._id)
    }
  },
})

export const updatePresence = mutation({
  args: {
    eventId: v.id('events'),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const participant = await ctx.db
      .query('participants')
      .withIndex('by_user_and_event', (q) =>
        q.eq('userId', args.userId).eq('eventId', args.eventId),
      )
      .unique()

    if (participant) {
      await ctx.db.patch(participant._id, { lastSeen: Date.now() })
    }
  },
})

export const getActiveParticipants = query({
  args: {
    eventId: v.id('events'),
  },
  handler: async (ctx, args) => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
    const activeParticipants = await ctx.db
      .query('participants')
      .withIndex('by_event_id', (q) => q.eq('eventId', args.eventId))
      .filter((q) => q.gt(q.field('lastSeen'), fiveMinutesAgo))
      .collect()

    const activeParticipantsWithUserInfo = await Promise.all(
      activeParticipants.map(async (p) => {
        const user = await ctx.db.get(p.userId)
        return {
          ...p,
          user,
        }
      }),
    )

    return activeParticipantsWithUserInfo.filter((p) => p.user !== null).filter(Boolean)
  },
})

export const getParticipantsByEvent = query({
  args: {
    eventId: v.id('events'),
  },
  handler: async (ctx, args) => {
    const participants = await ctx.db
      .query('participants')
      .withIndex('by_event_id', (q) => q.eq('eventId', args.eventId))
      .collect()

    const participantsWithData = await Promise.all(
      participants.map(async (p) => {
        const user = await ctx.db.get(p.userId)
        return {
          ...p,
          user,
        }
      }),
    )

    return participantsWithData
  },
})

export const updateParticipantRole = mutation({
  args: {
    participantId: v.id('participants'),
    role: v.union(
      v.literal('editor'),
      v.literal('viewer'),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Not authenticated')
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()

    if (!user) {
      throw new Error('User not found')
    }

    const participantToUpdate = await ctx.db.get(args.participantId)
    if (!participantToUpdate) {
      throw new Error('Participant not found')
    }

    const event = await ctx.db.get(participantToUpdate.eventId)
    if (!event) {
      throw new Error('Event not found')
    }

    if (event.ownerId !== user._id) {
      throw new Error('Not authorized to update participant roles for this event')
    }

    await ctx.db.patch(args.participantId, { role: args.role })
  },
})
