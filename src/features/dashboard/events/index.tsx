import { BarChart3, LayoutGrid, List } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'

import type { Event } from '@/types'

import { EventGridView } from './grid-view'
import { EventListView } from './list-view'
import { EventTimeline } from './timeline-view'

interface EventTimelineWrapperProps {
	events: Event[]
}

type ViewMode = 'timeline' | 'grid' | 'list'

export function EventTimelineWrapper({ events }: EventTimelineWrapperProps) {
	const [viewMode, setViewMode] = useState<ViewMode>('timeline')

	const sortedEvents = [...events].sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
	)

	const viewModes = [
		{ id: 'timeline' as ViewMode, label: 'Timeline', icon: BarChart3 },
		{ id: 'grid' as ViewMode, label: 'Grid', icon: LayoutGrid },
		{ id: 'list' as ViewMode, label: 'List', icon: List },
	]

	return (
		<div>
			{/* View mode switcher */}
			<div className="flex items-center justify-end gap-1 p-1 bg-accent/30 rounded mb-6 w-fit ml-auto">
				{viewModes.map((mode) => {
					const Icon = mode.icon
					return (
						<motion.button
							key={mode.id}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setViewMode(mode.id)}
							className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${
								viewMode === mode.id
									? 'bg-primary text-primary-foreground'
									: 'hover:bg-accent'
							}`}
							title={mode.label}
						>
							<Icon className="w-4 h-4" />
							<span className="text-sm">{mode.label}</span>
						</motion.button>
					)
				})}
			</div>

			{viewMode === 'grid' && <EventGridView events={sortedEvents} />}

			{viewMode === 'list' && <EventListView events={sortedEvents} />}

			{viewMode === 'timeline' && <EventTimeline events={sortedEvents} />}
		</div>
	)
}
