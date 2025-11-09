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
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return []
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()

    if (!user) {
      return []
    }

    const userEvents = await ctx.db
      .query('participants')
      .withIndex('by_user_id', (q) => q.eq('userId', user._id))
      .collect()

    const eventIds = userEvents.map((p) => p.eventId)

    const events = await Promise.all(
      eventIds.map(async (eventId) => await ctx.db.get(eventId)),
    )

    const eventsWithDetails = await Promise.all(
      events.map(async (event) => {
        if (!event) return null

        const agendaItems = await ctx.db
          .query('agendaItems')
          .withIndex('by_event_id', (q) => q.eq('eventId', event._id))
          .order('asc')
          .collect()

        const agendaItemsWithVotes = await Promise.all(
          agendaItems.map(async (item) => {
            const votes = await ctx.db
              .query('votes')
              .withIndex('by_agenda_item_id', (q) =>
                q.eq('agendaItemId', item._id),
              )
              .collect()

            const votedBy = await Promise.all(
              votes.map(async (vote) => await ctx.db.get(vote.userId)),
            )
            return {
              ...item,
              id: item._id,
              votedBy: votedBy.map((u) => (u ? u.name : 'Unknown')),
            }
          }),
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

    return eventsWithDetails.filter((e) => e !== null).filter(Boolean)
  },
})

export const getEvent = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')
    }

    const event = await ctx.db.get(args.eventId)

    if (!event) {
      throw new Error('Event not found')
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
          q.eq('userId', user._id).eq('eventId', event._id),
        )
        .unique()

      if (!participant) {
        throw new Error('Not authorized to view this event')
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
          .withIndex('by_agenda_item_id', (q) =>
            q.eq('agendaItemId', item._id),
          )
          .collect()

        const votedBy = await Promise.all(
          votes.map(async (vote) => await ctx.db.get(vote.userId)),
        )
        return {
          ...item,
          id: item._id,
          votedBy: votedBy.map((u) => (u ? u.name : 'Unknown')),
        }
      }),
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
      throw new Error('Not authorized to update this event')
    }

    const { eventId, ...fields } = args
    await ctx.db.patch(eventId, fields)
  },
})

export const deleteEvent = mutation({
  args: { eventId: v.id('events') },
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
      throw new Error('Not authorized to delete this event')
    }

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

