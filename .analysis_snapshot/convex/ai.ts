import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { streamText, tool } from 'ai'
import { ConvexError, v } from 'convex/values'
import { z } from 'zod'

import { api, internal } from './_generated/api'
import { action, internalMutation, mutation, query } from './_generated/server'
import { getUserId } from './users'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable not set.')
}

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
})

export const getMessages = query({
  args: {
    eventId: v.id('events'),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx)

    if (!userId) {
      throw new ConvexError('You must be logged in to view messages.')
    }

    const participant = await ctx.db
      .query('participants')
      .withIndex('by_user_and_event', (q) =>
        q.eq('userId', userId).eq('eventId', args.eventId),
      )
      .first()

    if (!participant || !['owner', 'editor'].includes(participant.role)) {
      return []
    }

    const messages = await ctx.db
      .query('aiChatMessages')
      .withIndex('by_event_id', (q) => q.eq('eventId', args.eventId))
      .collect()

          const messagesWithUsers = await Promise.all(
      messages.map(async (message) => {
        const user = await ctx.db.get(message.userId)
        return {
          ...message,
          user: user ? { name: user.name, avatar: user.avatar } : null,
        }
      }),
    )

    return messagesWithUsers
  },
})

export const sendMessage = mutation({
  args: {
    eventId: v.id('events'),
    content: v.string(),
    role: v.union(v.literal('user'), v.literal('assistant')),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx)

    if (!userId) {
      throw new ConvexError('You must be logged in to send a message.')
    }

    const participant = await ctx.db
      .query('participants')
      .withIndex('by_user_and_event', (q) =>
        q.eq('userId', userId).eq('eventId', args.eventId),
      )
      .first()

    if (!participant || !['owner', 'editor'].includes(participant.role)) {
      throw new ConvexError(
        'You must be an owner or editor to send a message.',
      )
    }

        const event = await ctx.runQuery(api.events.getEvent, {
      eventId: args.eventId,
    })

    if (!event) {
      throw new ConvexError('Event not found.')
    }

    const systemPrompt = `You are an expert event planner. The user is asking for help with their event: "${event.title}". The event is on ${event.date} and has a ${event.tone} tone. The goals are: ${event.goals}.`
    const userPrompt = `The user's message is: "${args.content}". Please provide a helpful response.`

    await ctx.db.insert('aiChatMessages', {
      eventId: args.eventId,
      userId,
      content: args.content,
      role: args.role,
    })

    if (args.role === 'user') {
      await ctx.scheduler.runAfter(0, api.ai.getAIResponse, {
        eventId: args.eventId,
        userId,
        system: systemPrompt,
        message: userPrompt,
      })
    }
  },
})

export const sendMessageInternal = internalMutation({
      args: {
    eventId: v.id('events'),
    content: v.string(),
    role: v.union(v.literal('user'), v.literal('assistant')),
    userId: v.id('users'),
  },
    handler: async (ctx, args) => {
            await ctx.db.insert('aiChatMessages', {
      eventId: args.eventId,
      userId: args.userId,
      content: args.content,
      role: args.role,
    })
    }
})

export const getAIResponse = action({
  args: {
    eventId: v.id('events'),
    userId: v.id('users'),
      system: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {


    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: args.system,
      prompt: args.message,
      tools: {
        createAgendaItem: tool({
                      description: 'Create an agenda item for the event based on the user\'s request.',
          inputSchema: z.object({
            title: z.string().describe('Title of the agenda item. Keep it short and concise.'),
            duration: z.number().describe('Duration of the agenda item in minutes. Keep it realistic.'),
            description: z.string().optional().describe('Description of the agenda item. Keep it brief.'),
            type: z.enum([
              'presentation',
              'discussion',
              'break',
              'activity',
            ]).describe('Type of the agenda item'),
          }),
          execute: async ({ title, duration, description, type }) => {
            await ctx.runMutation(internal.ai.createAgendaItems, {
              eventId: args.eventId,
              items: [{ title, duration, description, type }],
            })
            return `Agenda item "${title}" created successfully.`
          },
        }),
      },
    })

    let aiResponseContent = ''
    const agendaItemsCreated = [];
    for await (const part of result.fullStream) {

    switch (part.type) {
                case 'text-delta':
          aiResponseContent += part.text
          break
        case 'tool-call':
              agendaItemsCreated.push((part.input as Record<string, string>).title )
      break;
    case 'error':
      console.error('Stream error part:', part.error);
      break;
    }
    }

    if (agendaItemsCreated.length > 0) {
        aiResponseContent += `\n\nCreated agenda items: ${agendaItemsCreated.join(',\n')}.`
    }

        await ctx.runMutation(internal.ai.sendMessageInternal, {
      eventId: args.eventId,
      userId: args.userId,
      content: aiResponseContent,
      role: 'assistant',
    })
  },
})

export const createAgendaItems = internalMutation({
  args: {
    eventId: v.id('events'),
    items: v.array(
      v.object({
        title: v.string(),
        duration: v.number(),
        description: v.optional(v.string()),
        type: v.union(
          v.literal('presentation'),
          v.literal('discussion'),
          v.literal('break'),
          v.literal('activity'),
        ),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const existingAgendaItems = await ctx.db
      .query('agendaItems')
      .withIndex('by_event_id', (q) => q.eq('eventId', args.eventId))
      .collect()

    let order = existingAgendaItems.length

    for (const item of args.items) {
      await ctx.db.insert('agendaItems', {
        eventId: args.eventId,
        title: item.title,
        duration: item.duration,
        startTime: '00:00',
        description: item.description,
        votes: 0,
        type: item.type,
        order,
      })
      order++
    }
  },
})
