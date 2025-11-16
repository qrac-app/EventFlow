import { Link } from '@tanstack/react-router'
import { Calendar, ChevronRight, Clock, Users } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'

import { formatDate, getDaysUntil } from '@/lib/utils'

import type { Event } from '@/types'

interface EventTimelineProps {
	events: Event[]
}

export function EventTimeline({ events }: EventTimelineProps) {
	const [hoveredId, setHoveredId] = useState<string | null>(null)

	// Sort events by date
	const sortedEvents = [...events].sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
	)

	return (
		<div>
			<div className="relative py-12">
				{/* Vertical timeline line */}
				<div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border" />
				<motion.div
					className="absolute left-8 md:left-1/2 top-0 w-px bg-linear-to-b from-primary via-secondary to-primary"
					initial={{ height: 0 }}
					animate={{ height: '100%' }}
					transition={{ duration: 1.5, ease: 'easeOut' }}
				/>

				{/* Event nodes */}
				<div className="space-y-16">
					{sortedEvents.map((event, index) => {
						const daysUntil = getDaysUntil(event.date)
						const isLeft = index % 2 === 0

						return (
							<motion.div
								key={event.id}
								initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								className={`relative flex items-center ${
									isLeft ? 'md:justify-start' : 'md:justify-end'
								}`}
								onMouseEnter={() => setHoveredId(event.id)}
								onMouseLeave={() => setHoveredId(null)}
							>
								{/* Timeline node */}
								<motion.div
									className="absolute left-8 md:left-1/2 w-4 h-4 -ml-2 rounded-full bg-background border-2 border-primary z-10"
									whileHover={{ scale: 1.5 }}
									animate={
										hoveredId === event.id ? { scale: 1.5 } : { scale: 1 }
									}
								>
									<motion.div
										className="absolute inset-0 rounded-full bg-primary"
										animate={{
											scale: [1, 1.5, 1],
											opacity: [0.8, 0.3, 0.8],
										}}
										transition={{
											duration: 2,
											repeat: Infinity,
											delay: index * 0.3,
										}}
									/>
								</motion.div>

								{/* Event card */}
								<motion.div
									whileHover={{ scale: 1.02 }}
									className={`ml-16 md:ml-0 w-full md:w-[calc(50%-4rem)] ${
										isLeft ? 'md:pr-12' : 'md:pl-12'
									}`}
								>
									<Link
										to="/dashboard/events/$eventId"
										params={{ eventId: event.id }}
									>
										<motion.div
											className="relative p-6 bg-card/50 backdrop-blur-sm border border-border rounded cursor-pointer overflow-hidden group"
											whileHover={{ borderColor: 'var(--color-primary)' }}
										>
											{/* Glow effect on hover */}
											<motion.div
												className="absolute inset-0 bg-linear-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity"
												initial={false}
											/>

											{/* Status indicator */}
											<div className="flex items-center gap-2 mb-4">
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

											{/* Title */}
											<h3 className="mb-3 group-hover:text-primary transition-colors">
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
											</div>

											{/* Action */}
											<div className="flex items-center justify-between">
												<span className="text-sm text-muted-foreground">
													{event.tone === 'formal' ? '👔 Formal' : '😊 Casual'}
												</span>
												<motion.div
													className="flex items-center gap-1 text-sm text-primary"
													animate={{ x: hoveredId === event.id ? 5 : 0 }}
												>
													View Details
													<ChevronRight className="w-4 h-4" />
												</motion.div>
											</div>
										</motion.div>
									</Link>
								</motion.div>
							</motion.div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
