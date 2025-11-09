import { useStore } from '@nanostores/react'
import { Calendar, Clock, Sparkles, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Activity, useState } from 'react'

import type { AgendaItem } from '@/lib/mock-data'
import { agendaItemStore, toggleAgendaItem } from '@/stores/agenda-item'

interface AddItemModalProps {
	onSave: (item: Omit<AgendaItem, 'id' | 'votes' | 'votedBy'>) => void
}

export function AddItemModal({ onSave }: AddItemModalProps) {
	const { isOpen } = useStore(agendaItemStore)

	const [formData, setFormData] = useState({
		title: '',
		duration: 30,
		startTime: '',
		endTime: '',
		description: '',
		type: 'discussion' as AgendaItem['type'],
	})

	const handleSubmit = () => {
		onSave({
			...formData,
			duration: Number(formData.duration),
		})
		// Reset form
		setFormData({
			title: '',
			duration: 30,
			startTime: '',
			endTime: '',
			description: '',
			type: 'discussion',
		})
	}

	return (
		<AnimatePresence>
			<Activity mode={isOpen ? 'visible' : 'hidden'}>
				{/* Backdrop */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={toggleAgendaItem}
					className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
				/>

				{/* Modal */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95, y: 20 }}
					transition={{ type: 'spring', damping: 30, stiffness: 300 }}
					className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-card border border-border rounded z-50 overflow-hidden"
				>
					{/* Header */}
					<div className="relative p-6 border-b border-border">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center">
									<Sparkles className="w-5 h-5 text-primary-foreground" />
								</div>
								<div>
									<h2>Add Agenda Item</h2>
									<p className="text-sm text-muted-foreground">
										Fill in the details for the new agenda item.
									</p>
								</div>
							</div>
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={toggleAgendaItem}
								className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
							>
								<X className="w-5 h-5" />
							</motion.button>
						</div>
					</div>

					{/* Content */}
					<div className="p-6 max-h-[60vh] overflow-y-auto">
						<div className="space-y-6">
							{/* Title */}
							<div>
								<label htmlFor="title" className="block mb-2">
									Title
								</label>
								<input
									type="text"
									name="title"
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
									placeholder="e.g., Opening Remarks"
									className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>

							{/* Start Time, End Time, and Duration */}
							<div className="grid grid-cols-3 gap-4">
								<div>
									<label
										htmlFor="startTime"
										className="mb-2 flex items-center gap-2"
									>
										<Calendar className="w-4 h-4" />
										Start Time
									</label>
									<input
										type="time"
										name="startTime"
										value={formData.startTime}
										onChange={(e) =>
											setFormData({ ...formData, startTime: e.target.value })
										}
										className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>
								<div>
									<label
										htmlFor="endTime"
										className="mb-2 flex items-center gap-2"
									>
										<Calendar className="w-4 h-4" />
										End Time
									</label>
									<input
										type="time"
										name="endTime"
										value={formData.endTime}
										onChange={(e) =>
											setFormData({ ...formData, endTime: e.target.value })
										}
										className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>
								<div>
									<label
										htmlFor="duration"
										className="mb-2 flex items-center gap-2"
									>
										<Clock className="w-4 h-4" />
										Duration (minutes)
									</label>
									<input
										name="duration"
										type="number"
										value={formData.duration}
										onChange={(e) =>
											setFormData({
												...formData,
												duration: Number(e.target.value),
											})
										}
										min="5"
										step="5"
										className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>
							</div>

							{/* Type */}
							<div>
								<label htmlFor="type" className="block mb-3">
									Type
								</label>
								<div className="grid grid-cols-4 gap-2">
									{(
										['presentation', 'discussion', 'break', 'activity'] as const
									).map((type) => (
										<motion.button
											key={type}
											type="button"
											name="type"
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={() => setFormData({ ...formData, type })}
											className={`p-2 text-sm border-2 rounded transition-all ${
												formData.type === type
													? 'border-primary bg-primary/10'
													: 'border-border hover:border-primary/50'
											}`}
										>
											{type.charAt(0).toUpperCase() + type.slice(1)}
										</motion.button>
									))}
								</div>
							</div>

							{/* Description */}
							<div>
								<label htmlFor="description" className="block mb-2">
									Description
								</label>
								<textarea
									value={formData.description}
									name="description"
									onChange={(e) =>
										setFormData({
											...formData,
											description: e.target.value,
										})
									}
									placeholder="Provide a brief description of this agenda item."
									rows={3}
									className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary resize-none"
								/>
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className="p-6 border-t border-border flex justify-end gap-4">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={toggleAgendaItem}
							className="px-6 py-3 border border-border rounded hover:border-primary transition-colors"
						>
							Cancel
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleSubmit}
							disabled={!formData.title}
							className="px-6 py-3 bg-primary text-primary-foreground rounded disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Add Item
						</motion.button>
					</div>
				</motion.div>
			</Activity>
		</AnimatePresence>
	)
}
