import {
	BarChart3,
	Calendar,
	Clock,
	Edit,
	GripVertical,
	LayoutGrid,
	List,
	Plus,
	ThumbsUp,
} from 'lucide-react'
import { motion, Reorder } from 'motion/react'
import { useState } from 'react'

import type { AgendaItem } from '@/types'

import { AgendaCalendarView } from './agenda/calendar-view'
import { AgendaGanttView } from './agenda/gantt-view'
import { AgendaItemEditor } from './agenda/item-editor'
import { AgendaKanbanView } from './agenda/kanban-view'
import { AgendaTableView } from './agenda/table-view'

interface AgendaTimelineProps {
	agenda: AgendaItem[]
	onReorder: (newAgenda: AgendaItem[]) => void
	onVote: (itemId: string) => void
	onAddItem: () => void
	onUpdateItem: (updatedItem: AgendaItem) => void
	onDeleteItem: (itemId: string) => void
}

type ViewMode = 'timeline' | 'gantt' | 'kanban' | 'table' | 'calendar'

export function AgendaTimeline({
	agenda,
	onReorder,
	onVote,
	onAddItem,
	onUpdateItem,
	onDeleteItem,
}: AgendaTimelineProps) {
	const [expandedId, setExpandedId] = useState<string | null>(null)
	const [hoveredId, setHoveredId] = useState<string | null>(null)
	const [editingItem, setEditingItem] = useState<AgendaItem | null>(null)
	const [viewMode, setViewMode] = useState<ViewMode>('timeline')

	const totalDuration = agenda.reduce((sum, item) => sum + item.duration, 0)

	const viewModes = [
		{ id: 'timeline' as ViewMode, label: 'Timeline', icon: BarChart3 },
		{ id: 'gantt' as ViewMode, label: 'Gantt', icon: BarChart3 },
		{ id: 'kanban' as ViewMode, label: 'Kanban', icon: LayoutGrid },
		{ id: 'table' as ViewMode, label: 'Table', icon: List },
		{ id: 'calendar' as ViewMode, label: 'Calendar', icon: Calendar },
	]

	const handleEditClick = (item: AgendaItem, e: React.MouseEvent) => {
		e.stopPropagation()
		setEditingItem(item)
	}

	const handleSaveItem = (updatedItem: AgendaItem) => {
		onUpdateItem(updatedItem)
		setEditingItem(null)
	}

	const handleDeleteItem = () => {
		if (editingItem) {
			onDeleteItem(editingItem.id)
			setEditingItem(null)
		}
	}

	return (
		<div className="relative">
			{/* Timeline header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sticky top-0 bg-background/80 backdrop-blur-sm z-20 py-4">
				<div>
					<h2 className="mb-1">Event Agenda</h2>
					<p className="text-muted-foreground">
						{agenda.length} items • {totalDuration} minutes total
					</p>
				</div>

				<div className="flex items-center gap-4">
					{/* View mode switcher */}
					<div className="flex items-center gap-1 p-1 bg-accent/30 rounded">
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
									<span className="hidden sm:inline text-sm">{mode.label}</span>
								</motion.button>
							)
						})}
					</div>

					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={onAddItem}
						className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded"
					>
						<Plus className="w-4 h-4" />
						Add Item
					</motion.button>
				</div>
			</div>

			{/* Render different views based on mode */}
			{viewMode === 'gantt' && (
				<AgendaGanttView
					agenda={agenda}
					onEditItem={(item) => setEditingItem(item)}
					onVote={onVote}
				/>
			)}

			{viewMode === 'kanban' && (
				<AgendaKanbanView
					agenda={agenda}
					onEditItem={(item) => setEditingItem(item)}
					onVote={onVote}
				/>
			)}

			{viewMode === 'table' && (
				<AgendaTableView
					agenda={agenda}
					onEditItem={(item) => setEditingItem(item)}
					onVote={onVote}
					onDeleteItem={onDeleteItem}
				/>
			)}

			{viewMode === 'calendar' && (
				<AgendaCalendarView
					agenda={agenda}
					onEditItem={(item) => setEditingItem(item)}
					onVote={onVote}
				/>
			)}

			{/* Horizontal scrollable timeline - original view */}
			{viewMode === 'timeline' && (
				<div className="relative pb-8">
					<div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
						<Reorder.Group
							axis="x"
							values={agenda}
							onReorder={onReorder}
							className="flex gap-4"
						>
							{agenda.map((item, index) => {
								const widthPercent = (item.duration / totalDuration) * 100
								const isExpanded = expandedId === item.id
								const isHovered = hoveredId === item.id

								return (
									<Reorder.Item
										key={item.id}
										value={item}
										className="relative"
										style={{
											minWidth: `${Math.max(widthPercent * 10, 220)}px`,
											width: `${widthPercent * 10}px`,
										}}
									>
										<motion.div
											className="relative h-full cursor-pointer"
											onHoverStart={() => setHoveredId(item.id)}
											onHoverEnd={() => setHoveredId(null)}
											onClick={() => setExpandedId(isExpanded ? null : item.id)}
											whileHover={{ scale: 1.02 }}
											layout
										>
											{/* Agenda block */}
											<motion.div
												className={`relative p-6 rounded border-2 transition-all overflow-hidden ${
													isExpanded ? 'border-primary' : 'border-border'
												}`}
												animate={{
													height: isExpanded ? 'auto' : '200px',
												}}
												style={{
													background: `linear-gradient(135deg, var(--color-card) 0%, var(--color-accent) 100%)`,
												}}
											>
												{/* Glow effect */}
												<motion.div
													className={`absolute inset-0 opacity-0 transition-opacity ${
														isHovered || isExpanded ? 'opacity-100' : ''
													}`}
													style={{
														background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`,
														opacity: 0.1,
													}}
												/>

												{/* Drag handle */}
												<div className="absolute top-4 right-4 cursor-grab active:cursor-grabbing">
													<GripVertical className="w-4 h-4 text-muted-foreground" />
												</div>

												{/* Type indicator */}
												<motion.div
													className="absolute top-0 left-0 right-0 h-1 rounded-t"
													style={{
														background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`,
													}}
													animate={{
														opacity: isHovered || isExpanded ? 1 : 0.5,
													}}
												/>

												{/* Content */}
												<div className="relative z-10">
													{/* Time badge */}
													<div className="flex items-center gap-2 mb-3">
														<div className="px-3 py-1 bg-background/50 backdrop-blur-sm rounded-full text-xs flex items-center gap-1">
															<Clock className="w-3 h-3" />
															{item.duration}m
														</div>
														<div className="px-3 py-1 bg-background/50 backdrop-blur-sm rounded-full text-xs">
															{item.startTime}
														</div>
													</div>

													{/* Title */}
													<h3 className="mb-2 line-clamp-2">{item.title}</h3>

													{/* Description - only show when expanded */}
													<motion.div
														initial={false}
														animate={{
															opacity: isExpanded ? 1 : 0,
															height: isExpanded ? 'auto' : 0,
														}}
														className="overflow-hidden"
													>
														<p className="text-sm text-muted-foreground mb-4">
															{item.description}
														</p>
													</motion.div>

													{/* Type badge */}
													<div className="inline-block px-3 py-1 bg-background/50 backdrop-blur-sm rounded-full text-xs mb-4 capitalize">
														{item.type}
													</div>

													{/* Voting section */}
													<div className="flex items-center justify-between pt-4 border-t border-border/50">
														<div className="flex items-center gap-2">
															<motion.button
																whileHover={{ scale: 1.1 }}
																whileTap={{ scale: 0.9 }}
																onClick={(e) => {
																	e.stopPropagation()
																	onVote(item.id)
																}}
																className="flex items-center gap-2 px-3 py-1.5 bg-background/50 backdrop-blur-sm rounded hover:bg-primary/20 transition-colors"
															>
																<ThumbsUp className="w-4 h-4" />
																<motion.span
																	key={item.votes}
																	initial={{
																		scale: 1.5,
																		color: 'var(--color-primary)',
																	}}
																	animate={{ scale: 1, color: 'inherit' }}
																	transition={{ duration: 0.3 }}
																>
																	{item.votes}
																</motion.span>
															</motion.button>

															<motion.button
																whileHover={{ scale: 1.1 }}
																whileTap={{ scale: 0.9 }}
																onClick={(e) => handleEditClick(item, e)}
																className="flex items-center gap-2 px-3 py-1.5 bg-background/50 backdrop-blur-sm rounded hover:bg-secondary/20 transition-colors"
															>
																<Edit className="w-4 h-4" />
															</motion.button>
														</div>

														{/* Avatars */}
														{item.votedBy.length > 0 && (
															<div className="flex -space-x-2">
																{item.votedBy.slice(0, 3).map((userId, i) => (
																	<motion.div
																		key={userId}
																		className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-secondary border-2 border-background"
																		initial={{ scale: 0 }}
																		animate={{ scale: 1 }}
																		transition={{ delay: i * 0.1 }}
																		whileHover={{ scale: 1.2, zIndex: 10 }}
																	/>
																))}
																{item.votedBy.length > 3 && (
																	<div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
																		+{item.votedBy.length - 3}
																	</div>
																)}
															</div>
														)}
													</div>
												</div>

												{/* Connecting line */}
												{index < agenda.length - 1 && (
													<motion.div
														className="absolute top-1/2 -right-4 w-4 h-0.5 bg-border"
														animate={{
															backgroundColor: isHovered
																? 'var(--color-primary)'
																: 'var(--color-border)',
														}}
													/>
												)}
											</motion.div>
										</motion.div>
									</Reorder.Item>
								)
							})}
						</Reorder.Group>
					</div>

					{/* Timeline scale */}
					<div className="mt-4 px-2">
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>Start</span>
							<span>{totalDuration} minutes</span>
							<span>End</span>
						</div>
						<div className="h-1 bg-border rounded-full mt-2 relative overflow-hidden">
							<motion.div
								className="absolute inset-y-0 left-0 bg-linear-to-r from-primary to-secondary rounded-full"
								initial={{ width: 0 }}
								animate={{ width: '100%' }}
								transition={{ duration: 1.5, ease: 'easeOut' }}
							/>
						</div>
					</div>
				</div>
			)}

			{/* Edit Modal */}
			{editingItem && (
				<AgendaItemEditor
					item={editingItem}
					isOpen={!!editingItem}
					onClose={() => setEditingItem(null)}
					onSave={handleSaveItem}
					onDelete={handleDeleteItem}
				/>
			)}
		</div>
	)
}
