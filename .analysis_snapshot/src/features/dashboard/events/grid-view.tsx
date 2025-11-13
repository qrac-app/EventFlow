import { Link } from '@tanstack/react-router'
import { Calendar, ChevronRight, Clock, Users } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'

import { formatDate, getDaysUntil } from '@/lib/utils'

import type { Event } from '@/types'

interface EventGridViewProps {
	events: Event[]
}

export function EventGridView({ events }: EventGridViewProps) {
	const [hoveredId, setHoveredId] = useState<string | null>(null)

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{events.map((event, index) => {
				const daysUntil = getDaysUntil(event.date)

				return (
					<motion.div
						key={event.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: index * 0.1 }}
						whileHover={{ scale: 1.03 }}
						onMouseEnter={() => setHoveredId(event.id)}
						onMouseLeave={() => setHoveredId(null)}
						className="relative p-6 bg-card/50 backdrop-blur-sm border border-border rounded cursor-pointer overflow-hidden group hover:border-primary transition-all"
					>
						<Link
							to="/dashboard/events/$eventId"
							params={{ eventId: event.id }}
						>
							{/* Glow effect on hover */}
							<motion.div
								className="absolute inset-0 bg-linear-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity"
								initial={false}
							/>

							{/* Status indicator */}
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-2">
									<div
										className={`w-2 h-2 rounded-full ${
											event.status === 'upcoming'
												? 'bg-primary'
												: event.status === 'draft'
													? 'bg-muted-foreground'
													: 'bg-secondary'
										}`}
									/>
									<span className="text-sm text-muted-foreground capitalize">
										{event.status}
									</span>
									{event.status === 'upcoming' && daysUntil >= 0 && (
										<span className="text-sm text-muted-foreground">
											• {daysUntil === 0 ? 'Today' : `${daysUntil}d`}
										</span>
									)}
								</div>
								<span className="text-sm">
									{event.tone === 'formal' ? '👔' : '😊'}
								</span>
							</div>

							{/* Title */}
							<h3 className="mb-4 group-hover:text-primary transition-colors">
								{event.title}
							</h3>

							{/* Metadata */}
							<div className="space-y-2 mb-4">
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Calendar className="w-4 h-4" />
									{formatDate(event.date)}
								</div>
								<div className="flex items-center gap-4 text-sm text-muted-foreground">
									<div className="flex items-center gap-2">
										<Clock className="w-4 h-4" />
										{event.duration}h
									</div>
									<div className="flex items-center gap-2">
										<Users className="w-4 h-4" />
										{event.participants}
									</div>
								</div>
							</div>

							{/* Agenda preview */}
							<div className="mb-4">
								<div className="flex items-center gap-2 mb-2">
									<div className="h-px flex-1 bg-border" />
									<span className="text-xs text-muted-foreground">
										{event.agenda.length} items
									</span>
									<div className="h-px flex-1 bg-border" />
								</div>

								{/* Mini agenda items */}
								<div className="space-y-1">
									{event.agenda.slice(0, 3).map((item) => (
										<div
											key={item.id}
											className="flex items-center gap-2 text-xs text-muted-foreground"
										>
											<div className="w-1 h-1 rounded-full bg-primary" />
											<span className="truncate">{item.title}</span>
											<span className="text-[10px]">{item.duration}m</span>
										</div>
									))}
									{event.agenda.length > 3 && (
										<div className="text-xs text-muted-foreground pl-3">
											+{event.agenda.length - 3} more
										</div>
									)}
								</div>
							</div>

							{/* Action */}
							<div className="flex items-center justify-end">
								<motion.div
									className="flex items-center gap-1 text-sm text-primary"
									animate={{ x: hoveredId === event.id ? 5 : 0 }}
								>
									View Details
									<ChevronRight className="w-4 h-4" />
								</motion.div>
							</div>
						</Link>
					</motion.div>
				)
			})}
		</div>
	)
}
