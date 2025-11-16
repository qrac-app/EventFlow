import { Clock, Edit, ThumbsUp } from 'lucide-react'
import { motion } from 'motion/react'

import type { AgendaItem } from '@/types'

interface AgendaKanbanViewProps {
	agenda: AgendaItem[]
	onEditItem: (item: AgendaItem) => void
	onVote: (itemId: string) => void
}

const columns = [
	{
		key: 'presentation',
		title: 'Presentations',
		color: 'from-chart-2 to-chart-3',
	},
	{ key: 'discussion', title: 'Discussions', color: 'from-chart-1 to-chart-2' },
	{ key: 'activity', title: 'Activities', color: 'from-primary to-secondary' },
	{ key: 'break', title: 'Breaks', color: 'from-chart-4 to-chart-5' },
]

export function AgendaKanbanView({
	agenda,
	onEditItem,
	onVote,
}: AgendaKanbanViewProps) {
	const getItemsByType = (type: string) => {
		return agenda.filter((item) => item.type === type)
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{columns.map((column) => {
				const items = getItemsByType(column.key)
				const totalDuration = items.reduce(
					(sum, item) => sum + item.duration,
					0,
				)

				return (
					<div key={column.key} className="flex flex-col">
						{/* Column header */}
						<div className={`p-4 rounded-t bg-linear-to-r ${column.color}`}>
							<h3 className="text-white">{column.title}</h3>
							<p className="text-sm text-white/80 mt-1">
								{items.length} items • {totalDuration}m
							</p>
						</div>

						{/* Column body */}
						<div className="flex-1 p-4 bg-accent/20 rounded-b space-y-3 min-h-[400px]">
							{items.length === 0 ? (
								<div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
									No items
								</div>
							) : (
								items.map((item, index) => (
									<motion.div
										key={item.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.1 }}
										whileHover={{ scale: 1.02 }}
										className="p-4 bg-card border border-border rounded cursor-pointer group hover:border-primary transition-colors"
										onClick={() => onEditItem(item)}
									>
										{/* Time badges */}
										<div className="flex items-center gap-2 mb-3">
											<div className="px-2 py-1 bg-background/50 rounded-full text-xs flex items-center gap-1">
												<Clock className="w-3 h-3" />
												{item.duration}m
											</div>
											<div className="px-2 py-1 bg-background/50 rounded-full text-xs">
												{item.startTime}
											</div>
										</div>

										{/* Title */}
										<h4 className="mb-2 group-hover:text-primary transition-colors">
											{item.title}
										</h4>

										{/* Description */}
										<p className="text-sm text-muted-foreground mb-4 line-clamp-2">
											{item.description}
										</p>

										{/* Actions */}
										<div className="flex items-center justify-between pt-3 border-t border-border/50">
											<motion.button
												whileHover={{ scale: 1.1 }}
												whileTap={{ scale: 0.9 }}
												onClick={(e) => {
													e.stopPropagation()
													onVote(item.id)
												}}
												className="flex items-center gap-1 px-2 py-1 bg-background/50 rounded hover:bg-primary/20 transition-colors text-sm"
											>
												<ThumbsUp className="w-3 h-3" />
												{item.votes}
											</motion.button>

											<motion.button
												whileHover={{ scale: 1.1 }}
												whileTap={{ scale: 0.9 }}
												onClick={(e) => {
													e.stopPropagation()
													onEditItem(item)
												}}
												className="p-1.5 bg-background/50 rounded hover:bg-secondary/20 transition-colors"
											>
												<Edit className="w-4 h-4" />
											</motion.button>
										</div>

										{/* Voted by avatars */}
										{item.votedBy.length > 0 && (
											<div className="flex -space-x-2 mt-3">
												{item.votedBy.slice(0, 3).map((userId) => (
													<div
														key={userId}
														className="w-6 h-6 rounded-full bg-linear-to-br from-primary to-secondary border-2 border-background"
													/>
												))}
												{item.votedBy.length > 3 && (
													<div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px]">
														+{item.votedBy.length - 3}
													</div>
												)}
											</div>
										)}
									</motion.div>
								))
							)}
						</div>
					</div>
				)
			})}
		</div>
	)
}
