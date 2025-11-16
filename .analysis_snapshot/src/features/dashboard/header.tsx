import { Plus } from 'lucide-react'
import { motion } from 'motion/react'

import { ThemeButton } from '@/components/theme'

import { toggleEventFormModal } from '@/stores/event-form-modal'

export function DashboardHeader() {
	return (
		<div className="relative py-12 mb-8">
			{/* Background gradient */}
			<div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5 blur-3xl" />

			<div className="relative z-10 max-w-7xl mx-auto px-6">
				<div className="flex items-center justify-between">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h1 className="mb-2">My Events</h1>
						<p className="text-muted-foreground">
							Plan, collaborate, and execute seamlessly
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="flex items-center gap-3"
					>
						<ThemeButton />

						{/* Create button */}
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => toggleEventFormModal()}
							className="relative px-6 py-3 bg-primary text-primary-foreground rounded overflow-hidden group"
						>
							<span className="relative z-10 flex items-center gap-2">
								<Plus className="w-5 h-5" />
								Create Event
							</span>
							<motion.div
								className="absolute inset-0 bg-linear-to-r from-secondary to-primary"
								initial={{ x: '100%' }}
								whileHover={{ x: 0 }}
								transition={{ duration: 0.3 }}
							/>
						</motion.button>
					</motion.div>
				</div>
			</div>
		</div>
	)
}
