import { ArrowUpDown, Clock, Edit, ThumbsUp, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'

import type { AgendaItem } from '@/types'

interface AgendaTableViewProps {
	agenda: AgendaItem[]
	onEditItem: (item: AgendaItem) => void
	onVote: (itemId: string) => void
	onDeleteItem: (itemId: string) => void
}

type SortField = 'startTime' | 'duration' | 'votes' | 'title'
type SortOrder = 'asc' | 'desc'

const typeColors: Record<string, string> = {
	presentation: 'bg-chart-2',
	discussion: 'bg-chart-1',
	break: 'bg-chart-4',
	activity: 'bg-primary',
}

export function AgendaTableView({
	agenda,
	onEditItem,
	onVote,
	onDeleteItem,
}: AgendaTableViewProps) {
	const [sortField, setSortField] = useState<SortField>('startTime')
	const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
		} else {
			setSortField(field)
			setSortOrder('asc')
		}
	}

	const sortedAgenda = [...agenda].sort((a, b) => {
		let comparison = 0

		switch (sortField) {
			case 'startTime':
				comparison = a.startTime.localeCompare(b.startTime)
				break
			case 'duration':
				comparison = a.duration - b.duration
				break
			case 'votes':
				comparison = a.votes - b.votes
				break
			case 'title':
				comparison = a.title.localeCompare(b.title)
				break
		}

		return sortOrder === 'asc' ? comparison : -comparison
	})

	const totalDuration = agenda.reduce((sum, item) => sum + item.duration, 0)
	const totalVotes = agenda.reduce((sum, item) => sum + item.votes, 0)

	return (
		<div className="space-y-4">
			{/* Summary stats */}
			<div className="grid grid-cols-4 gap-4">
				<div className="p-4 bg-accent/20 rounded">
					<div className="text-sm text-muted-foreground">Total Items</div>
					<div className="text-2xl mt-1">{agenda.length}</div>
				</div>
				<div className="p-4 bg-accent/20 rounded">
					<div className="text-sm text-muted-foreground">Total Duration</div>
					<div className="text-2xl mt-1">{totalDuration}m</div>
				</div>
				<div className="p-4 bg-accent/20 rounded">
					<div className="text-sm text-muted-foreground">Total Votes</div>
					<div className="text-2xl mt-1">{totalVotes}</div>
				</div>
				<div className="p-4 bg-accent/20 rounded">
					<div className="text-sm text-muted-foreground">Avg Duration</div>
					<div className="text-2xl mt-1">
						{Math.round(totalDuration / agenda.length)}m
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="border border-border rounded overflow-hidden">
				<table className="w-full">
					<thead className="bg-accent/30">
						<tr>
							<th className="p-4 text-left">
								<button
									type="button"
									onClick={() => handleSort('startTime')}
									className="flex items-center gap-2 hover:text-primary transition-colors"
								>
									Start Time
									<ArrowUpDown className="w-4 h-4" />
								</button>
							</th>
							<th className="p-4 text-left">
								<button
									type="button"
									onClick={() => handleSort('title')}
									className="flex items-center gap-2 hover:text-primary transition-colors"
								>
									Title
									<ArrowUpDown className="w-4 h-4" />
								</button>
							</th>
							<th className="p-4 text-left">Type</th>
							<th className="p-4 text-left">
								<button
									type="button"
									onClick={() => handleSort('duration')}
									className="flex items-center gap-2 hover:text-primary transition-colors"
								>
									Duration
									<ArrowUpDown className="w-4 h-4" />
								</button>
							</th>
							<th className="p-4 text-left">
								<button
									type="button"
									onClick={() => handleSort('votes')}
									className="flex items-center gap-2 hover:text-primary transition-colors"
								>
									Votes
									<ArrowUpDown className="w-4 h-4" />
								</button>
							</th>
							<th className="p-4 text-left">Actions</th>
						</tr>
					</thead>
					<tbody>
						{sortedAgenda.map((item, index) => (
							<motion.tr
								key={item.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.05 }}
								className="border-t border-border hover:bg-accent/20 transition-colors group"
							>
								{/* Start Time */}
								<td className="p-4">
									<div className="flex items-center gap-2">
										<Clock className="w-4 h-4 text-muted-foreground" />
										{item.startTime}
									</div>
								</td>

								{/* Title & Description */}
								<td className="p-4">
									<div>
										<div>{item.title}</div>
										<div className="text-sm text-muted-foreground line-clamp-1">
											{item.description}
										</div>
									</div>
								</td>

								{/* Type */}
								<td className="p-4">
									<div className="flex items-center gap-2">
										<div
											className={`w-3 h-3 rounded-full ${typeColors[item.type] || 'bg-secondary'}`}
										/>
										<span className="capitalize text-sm">{item.type}</span>
									</div>
								</td>

								{/* Duration */}
								<td className="p-4">
									<div className="flex items-center gap-2">
										{item.duration}m{/* Duration bar */}
										<div className="w-16 h-2 bg-accent/30 rounded-full overflow-hidden">
											<div
												className={`h-full ${typeColors[item.type] || 'bg-secondary'}`}
												style={{ width: `${(item.duration / 90) * 100}%` }}
											/>
										</div>
									</div>
								</td>

								{/* Votes */}
								<td className="p-4">
									<motion.button
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={() => onVote(item.id)}
										className="flex items-center gap-2 px-3 py-1.5 bg-accent rounded-full hover:bg-primary/20 transition-colors"
									>
										<ThumbsUp className="w-4 h-4" />
										{item.votes}
									</motion.button>
								</td>

								{/* Actions */}
								<td className="p-4">
									<div className="flex items-center gap-2">
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											onClick={() => onEditItem(item)}
											className="p-2 bg-accent rounded hover:bg-secondary/20 transition-colors"
										>
											<Edit className="w-4 h-4" />
										</motion.button>
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											onClick={() => onDeleteItem(item.id)}
											className="p-2 bg-accent rounded hover:bg-destructive/20 transition-colors opacity-0 group-hover:opacity-100"
										>
											<Trash2 className="w-4 h-4 text-destructive" />
										</motion.button>
									</div>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
