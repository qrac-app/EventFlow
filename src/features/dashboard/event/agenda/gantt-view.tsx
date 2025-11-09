import { Clock, Edit } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'

import type { AgendaItem } from '@/types'

interface AgendaGanttViewProps {
	agenda: AgendaItem[]
	onEditItem: (item: AgendaItem) => void
	onVote: (itemId: string) => void
}

const typeColors: Record<string, string> = {
	presentation: 'bg-chart-2',
	discussion: 'bg-chart-1',
	break: 'bg-chart-4',
	activity: 'bg-primary',
}

export function AgendaGanttView({
	agenda,
	onEditItem,
	onVote,
}: AgendaGanttViewProps) {
	const [hoveredId, setHoveredId] = useState<string | null>(null)

	// Calculate total duration for scaling
	const totalDuration = agenda.reduce((sum, item) => sum + item.duration, 0)

	// Calculate cumulative start positions
	let cumulativeTime = 0
	const agendaWithPositions = agenda.map((item) => {
		const start = cumulativeTime
		cumulativeTime += item.duration
		return {
			...item,
			startPosition: start,
			widthPercent: (item.duration / totalDuration) * 100,
		}
	})

	return (
		<div className="space-y-6">
			{/* Time scale */}
			<div className="relative h-12 bg-accent/30 rounded overflow-hidden">
				<div className="absolute inset-0 flex">
					{agendaWithPositions.map((item) => (
						<div
							key={item.id}
							className="relative border-r border-border/50"
							style={{ width: `${item.widthPercent}%` }}
						>
							<div className="absolute top-0 left-2 text-xs text-muted-foreground">
								{item.startTime}
							</div>
							<div className="absolute bottom-0 left-2 text-xs">
								{item.duration}m
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Gantt bars */}
			<div className="space-y-3">
				{agendaWithPositions.map((item) => (
					<motion.div
						key={item.id}
						className="relative"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						onMouseEnter={() => setHoveredId(item.id)}
						onMouseLeave={() => setHoveredId(null)}
					>
						<div className="flex items-center gap-4">
							{/* Item title (fixed width) */}
							<div className="w-64 shrink-0">
								<div className="flex items-center gap-2">
									<div
										className={`w-3 h-3 rounded-full ${typeColors[item.type] || 'bg-secondary'}`}
									/>
									<span className="truncate">{item.title}</span>
								</div>
							</div>

							{/* Gantt bar container */}
							<div className="flex-1 relative">
								<div className="relative h-16 bg-accent/20 rounded">
									{/* Gantt bar */}
									<motion.div
										className={`absolute top-0 h-full rounded cursor-pointer overflow-hidden group ${
											typeColors[item.type] || 'bg-secondary'
										}`}
										style={{
											left: `${(item.startPosition / totalDuration) * 100}%`,
											width: `${item.widthPercent}%`,
										}}
										whileHover={{ scale: 1.02, zIndex: 10 }}
										onClick={() => onEditItem(item)}
									>
										{/* Gradient overlay */}
										<div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent" />

										{/* Content */}
										<div className="relative h-full p-3 flex flex-col justify-between">
											<div className="flex items-start justify-between gap-2">
												<span className="text-sm truncate text-white">
													{item.title}
												</span>
												<motion.button
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.9 }}
													onClick={(e) => {
														e.stopPropagation()
														onEditItem(item)
													}}
													className="opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white/20 rounded hover:bg-white/30"
												>
													<Edit className="w-3 h-3 text-white" />
												</motion.button>
											</div>

											<div className="flex items-center gap-2 text-xs text-white/90">
												<Clock className="w-3 h-3" />
												{item.duration}m
											</div>
										</div>
									</motion.div>
								</div>
							</div>

							{/* Votes */}
							<div className="w-16 shrink-0 text-center">
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={() => onVote(item.id)}
									className="px-3 py-1 bg-accent rounded-full text-sm hover:bg-primary/20 transition-colors"
								>
									👍 {item.votes}
								</motion.button>
							</div>
						</div>

						{/* Description tooltip on hover */}
						{hoveredId === item.id && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="absolute left-64 top-full mt-2 z-20 w-96 p-4 bg-card border border-border rounded shadow-lg"
							>
								<p className="text-sm text-muted-foreground">
									{item.description}
								</p>
							</motion.div>
						)}
					</motion.div>
				))}
			</div>

			{/* Timeline indicator */}
			<div className="flex items-center gap-4 text-xs text-muted-foreground">
				<div className="w-64" />
				<div className="flex-1 flex justify-between">
					<span>Start</span>
					<span>Total: {totalDuration} minutes</span>
					<span>End</span>
				</div>
				<div className="w-16" />
			</div>
		</div>
	)
}
