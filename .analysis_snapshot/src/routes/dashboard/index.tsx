import { convexQuery } from '@convex-dev/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { motion } from 'motion/react'
import { useState } from 'react'

import { LoadingSpinner } from '@/components/ui/loading-spinner'

import { EventTimelineWrapper } from '@/features/dashboard/events'
import { EmptyState } from '@/features/dashboard/events/empty-state'
import { EventFormModal } from '@/features/dashboard/events/event-form-modal'
import { DashboardHeader } from '@/features/dashboard/header'

import { api } from '~/convex/_generated/api'

export const Route = createFileRoute('/dashboard/')({
	beforeLoad: async ({ context: { convexQueryClient } }) => {
		await convexQueryClient.queryClient.ensureQueryData(
			convexQuery(api.events.getEvents, {}),
		)
	},
	component: RouteComponent,
})

function RouteComponent() {
	const events = useQuery(api.events.getEvents)
	const [activeFilter, setActiveFilter] = useState<string>('All Events')

	if (events === undefined) {
		return <LoadingSpinner />
	}

	return (
		<motion.div
			key="dashboard"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="pt-20"
		>
			<DashboardHeader />

			<div className="max-w-7xl mx-auto px-6 pb-20">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="flex gap-4 mb-8 overflow-x-auto pb-2"
				>
					{['All Events', 'Upcoming', 'Drafts', 'Completed'].map((tab) => {
						const count = events.filter((event) => {
							if (tab === 'All Events') return true
							if (tab === 'Upcoming') return event.status === 'upcoming'
							if (tab === 'Drafts') return event.status === 'draft'
							if (tab === 'Completed') return event.status === 'completed'
							return true
						}).length

						return (
							<motion.button
								key={tab}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setActiveFilter(tab)}
								className={`px-6 py-2 rounded-full transition-colors whitespace-nowrap flex items-center gap-2 ${
									tab === activeFilter
										? 'bg-primary text-primary-foreground'
										: 'bg-accent text-accent-foreground hover:bg-accent/80'
								}`}
							>
								{tab}
								<span
									className={`px-2 py-0.5 rounded-full text-xs ${
										tab === activeFilter
											? 'bg-primary-foreground/20'
											: 'bg-background/50'
									}`}
								>
									{count}
								</span>
							</motion.button>
						)
					})}
				</motion.div>

				{(() => {
					const filteredEvents = events.filter((event) => {
						if (activeFilter === 'All Events') return true
						if (activeFilter === 'Upcoming') return event.status === 'upcoming'
						if (activeFilter === 'Drafts') return event.status === 'draft'
						if (activeFilter === 'Completed')
							return event.status === 'completed'
						return true
					})

					return filteredEvents.length > 0 ? (
						<EventTimelineWrapper events={filteredEvents} />
					) : (
						<EmptyState filter={activeFilter} />
					)
				})()}
			</div>

			<EventFormModal />
		</motion.div>
	)
}
