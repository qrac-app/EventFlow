import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const createEvent = mutation({
  args: {
    title: v.string(),
    date: v.string(),
    duration: v.number(),
    status: v.union(
      v.literal('upcoming'),
      v.literal('draft'),
      v.literal('completed'),
    ),
    expectedParticipants: v.number(),
    goals: v.optional(v.string()),
    tone: v.union(v.literal('formal'), v.literal('casual')),
    isPublic: v.boolean(),
  },
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

    const now = new Date().toISOString()

    const eventId = await ctx.db.insert('events', {
      title: args.title,
      date: args.date,
      duration: args.duration,
      expectedParticipants: args.expectedParticipants,
      status: args.status,
      tone: args.tone,
      goals: args.goals,
      createdAt: now,
      ownerId: user._id,
      isPublic: args.isPublic,
    })

    await ctx.db.insert('participants', {
      userId: user._id,
      eventId: eventId,
      role: 'owner',
    })

    return eventId
  },
})

export const getEvents = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query('events').collect()

    const eventsWithDetails = await Promise.all(
      events.map(async (event) => {
        const agendaItems = await ctx.db
          .query('agendaItems')
          .withIndex('by_event_id', (q) => q.eq('eventId', event._id))
          .order('asc')
          .collect()

        const agendaItemsWithVotes = await Promise.all(
          agendaItems.map(async (item) => {
            const votes = await ctx.db
              .query('votes')
              .withIndex('by_agenda_item_id', (q) => q.eq('agendaItemId', item._id))
              .collect()

            const votedBy = await Promise.all(
              votes.map(async (vote) => await ctx.db.get(vote.userId))
            )
            return {
              ...item,
              id: item._id,
              votedBy: votedBy.map((u) => u ? u.name : 'Unknown' ),
            }
          })
        )

        const participants = await ctx.db
          .query('participants')
          .withIndex('by_event_id', (q) => q.eq('eventId', event._id))
          .collect()

        return {
          id: event._id,
          ...event,
          agenda: agendaItemsWithVotes,
          participants: participants.length,
        }
      }),
    )

    return eventsWithDetails
  },
})

export const getEvent = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId)

    if (!event) {
      throw new Error('Event not found')
    }

    const agendaItems = await ctx.db
      .query('agendaItems')
      .withIndex('by_event_id', (q) => q.eq('eventId', event._id))
      .order('asc')
      .collect()

              const agendaItemsWithVotes = await Promise.all(
          agendaItems.map(async (item) => {
            const votes = await ctx.db
              .query('votes')
              .withIndex('by_agenda_item_id', (q) => q.eq('agendaItemId', item._id))
              .collect()

            const votedBy = await Promise.all(
              votes.map(async (vote) => await ctx.db.get(vote.userId))
            )
            return {
              ...item,
              id: item._id,
              votedBy: votedBy.map((u) => u ? u.name : 'Unknown' ),
            }
          })
        )

    const participants = await ctx.db
      .query('participants')
      .withIndex('by_event_id', (q) => q.eq('eventId', event._id))
      .collect()

    return {
      id: event._id,
      ...event,
      agenda: agendaItemsWithVotes,
      participants: participants.length,
    }
  },
})

export const updateEvent = mutation({
  args: {
    eventId: v.id('events'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    date: v.optional(v.string()),
    duration: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal('upcoming'),
        v.literal('draft'),
        v.literal('completed'),
      ),
    ),
    tone: v.optional(v.union(v.literal('formal'), v.literal('casual'))),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { eventId, ...fields } = args
    await ctx.db.patch(eventId, fields)
  },
})

export const deleteEvent = mutation({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    // Delete associated agenda items
    const agendaItems = await ctx.db
      .query('agendaItems')
      .withIndex('by_event_id', (q) => q.eq('eventId', args.eventId))
      .collect()

    for (const agendaItem of agendaItems) {
      // Delete associated votes
      const votes = await ctx.db
        .query('votes')
        .withIndex('by_agenda_item_id', (q) => q.eq('agendaItemId', agendaItem._id))
        .collect()

      await Promise.all(votes.map((vote) => ctx.db.delete(vote._id)))

      // Delete the agenda item
      await ctx.db.delete(agendaItem._id)
    }

    // Delete associated participants
    const participants = await ctx.db
      .query('participants')
      .withIndex('by_event_id', (q) => q.eq('eventId', args.eventId))
      .collect()

    await Promise.all(
      participants.map((participant) => ctx.db.delete(participant._id)),
    )

    // Delete the event
    await ctx.db.delete(args.eventId)
  },
})

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
