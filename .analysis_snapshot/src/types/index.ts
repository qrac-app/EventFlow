import type { Doc, Id } from '~/convex/_generated/dataModel'

export type Event = Doc<'events'> & {
	id: Id<'events'>
	agenda: AgendaItem[]
	participants: number
}

export type AgendaItem = Doc<'agendaItems'> & {
	id: Id<'agendaItems'>
	votedBy: string[]
}
