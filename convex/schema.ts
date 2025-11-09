import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    avatar: v.string(),
    clerkId: v.string(),
  })
    .index('by_clerk_id', ['clerkId'])
    .index('by_email', ['email']),

  events: defineTable({
    title: v.string(),
    date: v.string(),
    duration: v.number(),
    status: v.union(
      v.literal('upcoming'),
      v.literal('draft'),
      v.literal('completed'),
    ),
    expectedParticipants: v.number(),
    tone: v.union(v.literal('formal'), v.literal('casual')),
    goals: v.optional(v.string()),
    createdAt: v.string(),
    ownerId: v.id('users'),
    isPublic: v.boolean(),
  }).index('by_owner_id', ['ownerId']),

  participants: defineTable({
    userId: v.id('users'),
    eventId: v.id('events'),
    role: v.union(
      v.literal('owner'),
      v.literal('editor'),
      v.literal('viewer'),
    ),
  })
    .index('by_event_id', ['eventId'])
    .index('by_user_id', ['userId'])
    .index('by_user_and_event', ['userId', 'eventId']),

  agendaItems: defineTable({
    eventId: v.id('events'),
    title: v.string(),
    duration: v.number(),
    startTime: v.string(),
    endTime: v.optional(v.string()),
    description: v.optional(v.string()),
    votes: v.number(),
    type: v.union(
      v.literal('presentation'),
      v.literal('discussion'),
      v.literal('break'),
      v.literal('activity'),
    ),
    order: v.number(),
  }).index('by_event_id', ['eventId']),

  votes: defineTable({
    userId: v.id('users'),
    agendaItemId: v.id('agendaItems'),
    eventId: v.id('events'),
  })
    .index('by_agenda_item_id', ['agendaItemId'])
    .index('by_user_and_agenda_item', ['userId', 'agendaItemId']),
})
