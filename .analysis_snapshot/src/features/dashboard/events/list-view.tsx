import { Link } from '@tanstack/react-router'
import { Calendar, ChevronRight, Clock, Users } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'

import { formatDate, getDaysUntil } from '@/lib/utils'

import type { Event } from '@/types'

interface EventListViewProps {
	events: Event[]
}

export function EventListView({ events }: EventListViewProps) {
	const [hoveredId, setHoveredId] = useState<string | null>(null)

	// Sort events by date
	const sortedEvents = [...events].sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
	)

	return (
		<div className="space-y-3">
			{sortedEvents.map((event, index) => {
				const daysUntil = getDaysUntil(event.date)

				return (
					<motion.div
						key={event.id}
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.4, delay: index * 0.05 }}
						whileHover={{ scale: 1.01 }}
						onMouseEnter={() => setHoveredId(event.id)}
						onMouseLeave={() => setHoveredId(null)}
						className="relative p-4 bg-card/50 backdrop-blur-sm border border-border rounded cursor-pointer overflow-hidden group hover:border-primary transition-all"
					>
						<Link
							to="/dashboard/events/$eventId"
							params={{ eventId: event.id }}
						>
							{/* Glow effect on hover */}
							<motion.div
								className="absolute inset-0 bg-linear-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"
								initial={false}
							/>

							<div className="flex items-center gap-6">
								{/* Date badge */}
								<div className="shrink-0 w-20 text-center">
									<div className="text-2xl">
										{new Date(event.date).getDate()}
									</div>
									<div className="text-xs text-muted-foreground uppercase">
										{new Date(event.date).toLocaleDateString('en-US', {
											month: 'short',
										})}
									</div>
								</div>

								{/* Status indicator */}
								<div className="shrink-0">
									<div
										className={`w-3 h-3 rounded-full ${
											event.status === 'upcoming'
												? 'bg-primary'
												: event.status === 'draft'
													? 'bg-muted-foreground'
													: 'bg-secondary'
										}`}
									/>
								</div>

								{/* Content */}
								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between gap-4 mb-2">
										<h3 className="group-hover:text-primary transition-colors truncate">
											{event.title}
										</h3>
										{event.status === 'upcoming' && daysUntil >= 0 && (
											<span className="shrink-0 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
												{daysUntil === 0 ? 'Today' : `in ${daysUntil}d`}
											</span>
										)}
									</div>

									<div className="flex items-center gap-6 text-sm text-muted-foreground">
										<div className="flex items-center gap-2">
											<Calendar className="w-4 h-4" />
											{formatDate(event.date)}
										</div>
										<div className="flex items-center gap-2">
											<Clock className="w-4 h-4" />
											{event.duration}h
										</div>
										<div className="flex items-center gap-2">
											<Users className="w-4 h-4" />
											{event.participants}
										</div>
										<div className="flex items-center gap-2">
											<span>{event.agenda.length} agenda items</span>
										</div>
										<div className="flex items-center gap-2">
											{event.tone === 'formal' ? '👔 Formal' : '😊 Casual'}
										</div>
									</div>
								</div>

								{/* Arrow */}
								<motion.div
									className="shrink-0 text-primary"
									animate={{ x: hoveredId === event.id ? 5 : 0 }}
								>
									<ChevronRight className="w-5 h-5" />
								</motion.div>
							</div>
						</Link>
					</motion.div>
				)
			})}
		</div>
	)
}
