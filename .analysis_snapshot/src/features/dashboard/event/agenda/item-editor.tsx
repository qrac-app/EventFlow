import { Save, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

import type { AgendaItem } from '@/types'

interface AgendaItemEditorProps {
	item: AgendaItem
	isOpen: boolean
	onClose: () => void
	onSave: (updatedItem: AgendaItem) => void
	onDelete: () => void
}

export function AgendaItemEditor({
	item,
	isOpen,
	onClose,
	onSave,
	onDelete,
}: AgendaItemEditorProps) {
	const [formData, setFormData] = useState<AgendaItem>(item)

	const handleSave = () => {
		onSave(formData)
		onClose()
	}

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
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
						<div className="flex items-center justify-between p-6 border-b border-border">
							<h3>Edit Agenda Item</h3>
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={onClose}
								className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
							>
								<X className="w-5 h-5" />
							</motion.button>
						</div>

						{/* Content */}
						<div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
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
									className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>

							{/* Description */}
							<div>
								<label htmlFor="description" className="block mb-2">
									Description
								</label>
								<textarea
									name="description"
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									rows={4}
									className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary resize-none"
								/>
							</div>

							{/* Duration and Start Time */}
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label htmlFor="duration" className="block mb-2">
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

								<div>
									<label htmlFor="startTime" className="block mb-2">
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
							</div>

							{/* Type */}
							<div>
								<label htmlFor="type" className="block mb-3">
									Item Type
								</label>
								<div className="grid grid-cols-4 gap-2">
									{(
										['presentation', 'discussion', 'break', 'activity'] as const
									).map((type) => (
										<motion.button
											key={type}
											name="type"
											type="button"
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={() => setFormData({ ...formData, type })}
											className={`p-3 border-2 rounded transition-all capitalize ${
												formData.type === type
													? 'border-primary bg-primary/10'
													: 'border-border hover:border-primary/50'
											}`}
										>
											{type}
										</motion.button>
									))}
								</div>
							</div>
						</div>

						{/* Footer */}
						<div className="p-6 border-t border-border flex justify-between">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={onDelete}
								className="px-6 py-3 border border-destructive text-destructive rounded hover:bg-destructive/10 transition-colors"
							>
								Delete Item
							</motion.button>

							<div className="flex gap-3">
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={onClose}
									className="px-6 py-3 border border-border rounded hover:border-primary transition-colors"
								>
									Cancel
								</motion.button>

								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={handleSave}
									className="px-6 py-3 bg-primary text-primary-foreground rounded flex items-center gap-2"
								>
									<Save className="w-4 h-4" />
									Save Changes
								</motion.button>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}
