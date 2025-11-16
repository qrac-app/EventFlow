import { Clock, Edit, ThumbsUp } from 'lucide-react'
import { motion } from 'motion/react'

import type { AgendaItem } from '@/types'

interface AgendaCalendarViewProps {
	agenda: AgendaItem[]
	onEditItem: (item: AgendaItem) => void
	onVote: (itemId: string) => void
}

const typeColors: Record<string, string> = {
	presentation: 'bg-chart-2 border-chart-2',
	discussion: 'bg-chart-1 border-chart-1',
	break: 'bg-chart-4 border-chart-4',
	activity: 'bg-primary border-primary',
}

export function AgendaCalendarView({
	agenda,
	onEditItem,
	onVote,
}: AgendaCalendarViewProps) {
	// Parse times and create hourly slots
	const parseTime = (timeStr: string) => {
		const [hours, minutes] = timeStr.split(':').map(Number)
		return hours * 60 + minutes // Convert to minutes from midnight
	}

	// Find time range
	const times = agenda.map((item) => parseTime(item.startTime))
	const startHour = Math.floor(Math.min(...times) / 60)
	const endTime = Math.max(...times.map((time, i) => time + agenda[i].duration))
	const endHour = Math.ceil(endTime / 60)

	// Generate hour slots
	const hours = Array.from(
		{ length: endHour - startHour + 1 },
		(_, i) => startHour + i,
	)

	// Position items in calendar
	const itemsWithPosition = agenda.map((item) => {
		const startMinutes = parseTime(item.startTime)
		const startFromFirst = startMinutes - startHour * 60
		const top = (startFromFirst / 60) * 80 // 80px per hour
		const height = (item.duration / 60) * 80

		return {
			...item,
			top,
			height: Math.max(height, 40), // Minimum height for visibility
		}
	})

	return (
		<div className="flex gap-6">
			{/* Time axis */}
			<div className="shrink-0 w-20">
				<div className="h-12" /> {/* Spacer for header */}
				{hours.map((hour) => (
					<div
						key={hour}
						className="h-20 flex items-start justify-end pr-4 text-sm text-muted-foreground"
					>
						{hour.toString().padStart(2, '0')}:00
					</div>
				))}
			</div>

			{/* Calendar grid */}
			<div className="flex-1 relative">
				{/* Header */}
				<div className="h-12 flex items-center mb-2">
					<h3>Event Schedule</h3>
				</div>

				{/* Grid background */}
				<div className="relative bg-accent/10 rounded border border-border">
					{/* Hour lines */}
					{hours.map((hour) => (
						<div
							key={hour}
							className="h-20 border-b border-border/50 last:border-b-0"
						/>
					))}

					{/* Agenda items overlay */}
					<div className="absolute inset-0 p-2">
						{itemsWithPosition.map((item, index) => (
							<motion.div
								key={item.id}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: index * 0.1 }}
								className="absolute left-2 right-2 cursor-pointer group"
								style={{
									top: `${item.top}px`,
									height: `${item.height}px`,
								}}
								onClick={() => onEditItem(item)}
							>
								<motion.div
									whileHover={{ scale: 1.02, zIndex: 10 }}
									className={`h-full p-3 rounded border-l-4 ${
										typeColors[item.type] || 'bg-secondary border-secondary'
									} bg-opacity-90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all overflow-hidden`}
								>
									{/* Content */}
									<div className="h-full flex flex-col justify-between">
										<div>
											<div className="flex items-start justify-between gap-2 mb-1">
												<h4 className="text-sm line-clamp-1 text-white">
													{item.title}
												</h4>
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

											{item.height > 60 && (
												<p className="text-xs text-white/80 line-clamp-2 mb-2">
													{item.description}
												</p>
											)}
										</div>

										<div className="flex items-center justify-between gap-2">
											<div className="flex items-center gap-2 text-xs text-white/90">
												<Clock className="w-3 h-3" />
												{item.startTime} • {item.duration}m
											</div>

											{item.height > 50 && (
												<motion.button
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.9 }}
													onClick={(e) => {
														e.stopPropagation()
														onVote(item.id)
													}}
													className="flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full text-xs text-white hover:bg-white/30 transition-colors"
												>
													<ThumbsUp className="w-3 h-3" />
													{item.votes}
												</motion.button>
											)}
										</div>
									</div>
								</motion.div>
							</motion.div>
						))}
					</div>
				</div>
			</div>

			{/* Legend */}
			<div className="shrink-0 w-48 space-y-2">
				<div className="h-12 flex items-center">
					<span className="text-sm">Types</span>
				</div>
				{['presentation', 'discussion', 'activity', 'break'].map((type) => {
					const count = agenda.filter((item) => item.type === type).length
					return (
						<div key={type} className="flex items-center gap-3 text-sm">
							<div
								className={`w-4 h-4 rounded ${typeColors[type]?.split(' ')[0] || 'bg-secondary'}`}
							/>
							<span className="capitalize">{type}</span>
							<span className="text-muted-foreground">({count})</span>
						</div>
					)
				})}
			</div>
		</div>
	)
}
