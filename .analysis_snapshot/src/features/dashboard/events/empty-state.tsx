import { Calendar, Plus } from 'lucide-react'
import { motion } from 'motion/react'

import { toggleEventFormModal } from '@/stores/event-form-modal'

interface EmptyStateProps {
	filter: string
}

export function EmptyState({ filter }: EmptyStateProps) {
	const messages = {
		'All Events': 'No events yet',
		Upcoming: 'No upcoming events',
		Drafts: 'No draft events',
		Completed: 'No completed events',
	}

	const descriptions = {
		'All Events':
			'Create your first event to get started with AI-powered planning',
		Upcoming: 'All your upcoming events will appear here',
		Drafts: "Draft events you're working on will show here",
		Completed: 'Your past events will be listed here',
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex flex-col items-center justify-center py-20"
		>
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ delay: 0.2, type: 'spring' }}
				className="w-24 h-24 rounded-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6"
			>
				<Calendar className="w-12 h-12 text-muted-foreground" />
			</motion.div>

			<h3 className="mb-2">{messages[filter as keyof typeof messages]}</h3>
			<p className="text-muted-foreground mb-8 max-w-md text-center">
				{descriptions[filter as keyof typeof descriptions]}
			</p>

			{filter === 'All Events' && (
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => toggleEventFormModal()}
					className="px-6 py-3 bg-primary text-primary-foreground rounded flex items-center gap-2"
				>
					<Plus className="w-5 h-5" />
					Create Your First Event
				</motion.button>
			)}
		</motion.div>
	)
}
