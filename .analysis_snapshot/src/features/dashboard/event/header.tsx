import { Link } from '@tanstack/react-router'
import {
	ArrowLeft,
	Calendar,
	Clock,
	Edit,
	Share2,
	Sparkles,
	UserPlus,
	Users,
} from 'lucide-react'
import { motion } from 'motion/react'
import { Activity } from 'react'
import { toast } from 'sonner'

import { formatDate, formatTime } from '@/lib/utils'

import { toggleAddParticipantModal } from '@/stores/add-participant-modal'
import { toggleAIDrawer } from '@/stores/ai-drawer'
import { toggleEventFormModal } from '@/stores/event-form-modal'

import type { Event } from '@/types'

interface EventHeaderProps {
	event: Event
	canEdit: boolean
}

export function EventHeader({ event, canEdit }: EventHeaderProps) {
	const handleShare = () => {
		const eventUrl = `${window.location.origin}/dashboard/events/${event.id}`
		navigator.clipboard.writeText(eventUrl)
		toast.info('Link copied!', {
			description: 'The event link has been copied to your clipboard.',
		})
	}

	return (
		<div className="relative py-8 mb-8 border-b border-border">
			{/* Background effects */}
			<motion.div
				className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
				animate={{
					scale: [1, 1.2, 1],
					opacity: [0.3, 0.5, 0.3],
				}}
				transition={{
					duration: 8,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6">
				{/* Back button */}
				<motion.button
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					whileHover={{ x: -5 }}
				>
					<Link
						to="/dashboard"
						className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Events
					</Link>
				</motion.button>

				<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
					{/* Event info */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="flex-1"
					>
						{/* Status badge */}
						<div className="flex items-center gap-2 mb-4">
							<motion.div
								className={`w-2 h-2 rounded-full ${
									event.status === 'upcoming'
										? 'bg-primary'
										: event.status === 'draft'
											? 'bg-muted-foreground'
											: 'bg-secondary'
								}`}
								animate={{
									scale: event.status === 'upcoming' ? [1, 1.2, 1] : 1,
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
								}}
							/>
							<span className="text-sm text-muted-foreground capitalize">
								{event.status}
							</span>
						</div>

						<h1 className="mb-4">{event.title}</h1>

						{/* Metadata */}
						<div className="flex flex-wrap gap-6 text-muted-foreground">
							<div className="flex items-center gap-2">
								<Calendar className="w-4 h-4" />
								<span>
									{formatDate(event.date)} at {formatTime(event.date)}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Clock className="w-4 h-4" />
								<span>{event.duration} hours</span>
							</div>
							<div className="flex items-center gap-2">
								<Users className="w-4 h-4" />
								<span>{event.participants} participants</span>
							</div>
						</div>
					</motion.div>

					{/* Actions */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="flex gap-3"
					>
						<Activity mode={canEdit ? 'visible' : 'hidden'}>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => toggleEventFormModal(event)}
								className="px-6 py-3 bg-card border border-border rounded hover:border-primary transition-colors flex items-center gap-2"
							>
								<Edit className="w-4 h-4" />
								Edit Event
							</motion.button>
						</Activity>

						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="px-6 py-3 bg-card border border-border rounded hover:border-primary transition-colors flex items-center gap-2"
							onClick={handleShare}
						>
							<Share2 className="w-4 h-4" />
							Share
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={toggleAddParticipantModal}
							className="px-6 py-3 bg-card border border-border rounded hover:border-primary transition-colors flex items-center gap-2"
						>
							<UserPlus className="w-4 h-4" />
							Add Participant
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={toggleAIDrawer}
							className="relative px-6 py-3 bg-primary text-primary-foreground rounded overflow-hidden group"
						>
							<span className="relative z-10 flex items-center gap-2">
								<Sparkles className="w-4 h-4" />
								AI Assist
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
