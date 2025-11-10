import { convexQuery } from '@convex-dev/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useConvexAuth, useMutation, useQuery } from 'convex/react'
import { motion } from 'motion/react'
import { Activity } from 'react'

import { LoadingSpinner } from '@/components/ui/loading-spinner'

import { AIDrawer } from '@/features/ai/drawer'
import { ActiveUsers } from '@/features/dashboard/event/active-users'
import { AddParticipantModal } from '@/features/dashboard/event/add-participant-modal'
import { AgendaTimeline } from '@/features/dashboard/event/agenda-timeline'
import { AddItemModal } from '@/features/dashboard/event/agenda/add-item-modal'
import { EventHeader } from '@/features/dashboard/event/header'
import { ParticipantsList } from '@/features/dashboard/event/participants-list'
import { EventFormModal } from '@/features/dashboard/events/event-form-modal'

import { usePresence } from '@/hooks/use-presence'

import { toggleAgendaItem } from '@/stores/agenda-item'
import type { AgendaItem } from '@/types'

import { api } from '~/convex/_generated/api'
import type { Id } from '~/convex/_generated/dataModel'

export const Route = createFileRoute('/dashboard/events/$eventId')({
	beforeLoad: async ({ params, context: { convexQueryClient } }) => {
		await convexQueryClient.queryClient.ensureQueryData(
			convexQuery(api.events.getEvent, {
				eventId: params.eventId as Id<'events'>,
			}),
		)
	},
	component: RouteComponent,
	notFoundComponent: () => {
		const navigate = useNavigate()
		return (
			<div className="flex flex-col items-center justify-center h-full">
				<h1 className="text-2xl font-bold">Event not found</h1>
				<p className="text-gray-500">
					The event you are looking for does not exist or you do not have
					permission to view it.
				</p>
				<button
					type="button"
					className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
					onClick={() => navigate({ to: '/dashboard' })}
				>
					Go to dashboard
				</button>
			</div>
		)
	},
})

function RouteComponent() {
	const { eventId } = Route.useParams()
	const { isAuthenticated } = useConvexAuth()

	const currentEvent = useQuery(api.events.getEvent, {
		eventId: eventId as Id<'events'>,
	})
	const participant = useQuery(
		api.participants.getCurrentUserAsParticipant,
		isAuthenticated ? { eventId: eventId as Id<'events'> } : 'skip',
	)
	const activeParticipants = useQuery(api.participants.getActiveParticipants, {
		eventId,
	})

	const reorderAgendaItems = useMutation(api.agendas.reorderAgendaItems)
	const voteOnAgendaItem = useMutation(api.agendas.voteOnAgendaItem)
	const createAgendaItem = useMutation(api.agendas.createAgendaItem)
	const updateAgendaItem = useMutation(api.agendas.updateAgendaItem)
	const deleteAgendaItem = useMutation(api.agendas.deleteAgendaItem)

	usePresence(eventId, participant?.userId)

	if (currentEvent === undefined) {
		return <LoadingSpinner />
	}

	const activeUsers =
		activeParticipants?.map((p) => ({
			id: p.user?._id as Id<'users'>,
			name: p.user?.name || 'Unknown',
			avatar: p.user?.avatar || '',
			lastSeen: p.lastSeen ? new Date(p.lastSeen).toLocaleTimeString() : '',
		})) || []

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
		item: Omit<Partial<AgendaItem>, 'id' | 'votes' | 'votedBy'>,
	) => {
		await createAgendaItem({
			eventId: currentEvent.id,
			title: item.title || '',
			duration: item.duration || 0,
			startTime: item.startTime || '',
			endTime: item.endTime || '',
			description: item.description || '',
			type: item.type || 'activity',
		})
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

	return (
		<motion.div
			key="event"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="pt-20"
		>
			<EventHeader
				event={currentEvent}
				canEdit={participant?.role === 'owner'}
			/>

			<div className="max-w-7xl mx-auto px-6 pb-20">
				{activeUsers.length > 0 && (
					<div className="mb-6 flex justify-end">
						<ActiveUsers
							users={activeUsers}
							currentUserId={participant?.userId}
						/>
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

				<Activity
					mode={
						['editor', 'owner'].includes(participant?.role || '')
							? 'visible'
							: 'hidden'
					}
				>
					<ParticipantsList eventId={eventId as Id<'events'>} />
				</Activity>
			</div>

			<AIDrawer eventId={eventId as Id<'events'>} />
			<AddItemModal onSave={handleSaveNewAgendaItem} />
			<AddParticipantModal eventId={eventId as Id<'events'>} />
			<EventFormModal />
		</motion.div>
	)
}
