import { v } from 'convex/values'
import { mutation } from './_generated/server'

export const createAgendaItem = mutation({
  args: {
    eventId: v.id('events'),
    title: v.string(),
    duration: v.number(),
    startTime: v.string(),
    endTime: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.union(
      v.literal('presentation'),
      v.literal('discussion'),
      v.literal('break'),
      v.literal('activity'),
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

    const participant = await ctx.db
      .query('participants')
      .withIndex('by_user_and_event', (q) =>
        q.eq('userId', user._id).eq('eventId', args.eventId),
      )
      .unique()

    if (!participant) {
      throw new Error('Not authorized to add an agenda item to this event')
    }

    const existingAgendaItems = await ctx.db
      .query('agendaItems')
      .withIndex('by_event_id', (q) => q.eq('eventId', args.eventId))
      .collect()

    const agendaItemId = await ctx.db.insert('agendaItems', {
      eventId: args.eventId,
      title: args.title,
      duration: args.duration,
      startTime: args.startTime,
      // endTime: args.endTime,
      ...(args.endTime ? { endTime: args.endTime } : {}),
      description: args.description,
      votes: 0, // Initialize votes to 0
      type: args.type,
      order: existingAgendaItems.length,
    })
    return agendaItemId
  },
})

export const updateAgendaItem = mutation({
  args: {
    agendaItemId: v.id('agendaItems'),
    title: v.optional(v.string()),
    duration: v.optional(v.number()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(
      v.union(
        v.literal('presentation'),
        v.literal('discussion'),
        v.literal('break'),
        v.literal('activity'),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const { agendaItemId, ...fields } = args
    await ctx.db.patch(agendaItemId, fields)
  },
})

export const deleteAgendaItem = mutation({
  args: { agendaItemId: v.id('agendaItems') },
  handler: async (ctx, args) => {
    // Delete associated votes
    const votes = await ctx.db
      .query('votes')
      .withIndex('by_agenda_item_id', (q) =>
        q.eq('agendaItemId', args.agendaItemId),
      )
      .collect()

    await Promise.all(votes.map((vote) => ctx.db.delete(vote._id)))

    // Delete the agenda item
    await ctx.db.delete(args.agendaItemId)
  },
})

export const reorderAgendaItems = mutation({
  args: {
    eventId: v.id('events'),
    orderedAgendaItemIds: v.array(v.id('agendaItems')),
  },
  handler: async (ctx, args) => {
    for (let i = 0; i < args.orderedAgendaItemIds.length; i++) {
      const agendaItemId = args.orderedAgendaItemIds[i]
      await ctx.db.patch(agendaItemId, { order: i })
    }
  },
})

export const voteOnAgendaItem = mutation({
  args: { agendaItemId: v.id('agendaItems'), eventId: v.id('events') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Not authenticated')
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) =>
        q.eq('clerkId', identity.subject),
      )
      .unique()

    if (!user) {
      throw new Error('User not found')
    }

    const existingVote = await ctx.db
      .query('votes')
      .withIndex('by_user_and_agenda_item', (q) =>
        q.eq('userId', user._id).eq('agendaItemId', args.agendaItemId),
      )
      .unique()

    if (existingVote) {
      // User has already voted, so remove the vote
      await ctx.db.delete(existingVote._id)
      await ctx.db.patch(args.agendaItemId, { votes: (await ctx.db.get(args.agendaItemId))!.votes - 1 })
    } else {
      // User hasn't voted, so add the vote
      await ctx.db.insert('votes', {
        userId: user._id,
        agendaItemId: args.agendaItemId,
        eventId: args.eventId,
      })
      await ctx.db.patch(args.agendaItemId, { votes: (await ctx.db.get(args.agendaItemId))!.votes + 1 })
    }
  },
})
