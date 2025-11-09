import { convexQuery } from '@convex-dev/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { motion } from 'motion/react'

import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { AIDrawer } from '@/features/ai/drawer'
import { ActiveUsers } from '@/features/dashboard/event/active-users'
import { AgendaTimeline } from '@/features/dashboard/event/agenda-timeline'
import { AddItemModal } from '@/features/dashboard/event/agenda/add-item-modal'
import { EventHeader } from '@/features/dashboard/event/header'

import type { AgendaItem } from '@/lib/mock-data'
import { toggleAgendaItem } from '@/stores/agenda-item'

import { api } from '~/convex/_generated/api'
import type { Id } from '~/convex/_generated/dataModel'

interface ActiveUser {
	id: string
	name: string
	lastSeen: string
}

export const Route = createFileRoute('/dashboard/events/$eventId')({
	beforeLoad: async ({ params, context: { convexQueryClient } }) => {
		await convexQueryClient.queryClient.ensureQueryData(
			convexQuery(api.events.getEvent, {
				eventId: params.eventId as Id<'events'>,
			}),
		)
	},
	component: RouteComponent,
})

function RouteComponent() {
	const { eventId } = Route.useParams()

	const currentEvent = useQuery(api.events.getEvent, {
		eventId: eventId as Id<'events'>,
	})
	const activeUsers: ActiveUser[] = []

	const reorderAgendaItems = useMutation(api.events.reorderAgendaItems)
	const voteOnAgendaItem = useMutation(api.events.voteOnAgendaItem)
	const createAgendaItem = useMutation(api.events.createAgendaItem)
	const updateAgendaItem = useMutation(api.events.updateAgendaItem)
	const deleteAgendaItem = useMutation(api.events.deleteAgendaItem)

	if (currentEvent === undefined) {
		return <LoadingSpinner />
	}

	const handleAgendaReorder = async (orderedAgendaItem: AgendaItem[]) => {
		const orderedAgendaItemIds = orderedAgendaItem.map(
			(item) => item.id as Id<'agendaItems'>,
		)
		await reorderAgendaItems({ eventId: currentEvent.id, orderedAgendaItemIds })
	}

	const handleVote = async (agendaItemId: string) => {
		await voteOnAgendaItem({
			eventId: currentEvent.id,
			agendaItemId: agendaItemId as Id<'agendaItems'>,
		})
	}

	const handleSaveNewAgendaItem = async (
		item: Omit<AgendaItem, 'id' | 'votes' | 'votedBy'>,
	) => {
		await createAgendaItem({ eventId: currentEvent.id, ...item })
	}

	const handleUpdateAgendaItem = async (item: AgendaItem) => {
		await updateAgendaItem({
			agendaItemId: item.id as Id<'agendaItems'>,
			title: item.title,
			duration: item.duration,
			startTime: item.startTime,
			endTime: item.endTime,
			description: item.description,
			type: item.type,
		})
	}

	const handleDeleteAgendaItem = async (id: string) => {
		await deleteAgendaItem({ agendaItemId: id as Id<'agendaItems'> })
	}

	const handleGenerateAgenda = async (prompt: string) => {
		console.log('Generate agenda with prompt:', prompt)
	}

	return (
		<motion.div
			key="event"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="pt-20"
		>
			<EventHeader event={currentEvent} />

			<div className="max-w-7xl mx-auto px-6 pb-20">
				{activeUsers.length > 0 && (
					<div className="mb-6 flex justify-end">
						<ActiveUsers users={activeUsers} currentUserId={''} />
					</div>
				)}
				<AgendaTimeline
					agenda={currentEvent.agenda}
					onReorder={handleAgendaReorder}
					onVote={handleVote}
					onAddItem={toggleAgendaItem}
					onUpdateItem={handleUpdateAgendaItem}
					onDeleteItem={handleDeleteAgendaItem}
				/>
			</div>

			<AIDrawer onGenerate={handleGenerateAgenda} />
			<AddItemModal onSave={handleSaveNewAgendaItem} />
		</motion.div>
	)
}
