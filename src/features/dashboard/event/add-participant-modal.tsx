import { useStore } from '@nanostores/react'
import { useMutation, useQuery } from 'convex/react'
import { UserPlus, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Activity, useState } from 'react'
import { toast } from 'sonner'

import {
	addParticipantModalStore,
	toggleAddParticipantModal,
} from '@/stores/add-participant-modal'

import { api } from '~/convex/_generated/api'
import type { Id } from '~/convex/_generated/dataModel'

interface AddParticipantModalProps {
	eventId: Id<'events'>
}

export function AddParticipantModal({ eventId }: AddParticipantModalProps) {
	const { isOpen } = useStore(addParticipantModalStore)

	const [email, setEmail] = useState('')
	const [role, setRole] = useState<'editor' | 'viewer'>('viewer')

	const addParticipant = useMutation(api.events.addParticipant)
	const user = useQuery(api.users.findUserByEmail, { email })

	const handleSubmit = async () => {
		if (user) {
			await addParticipant({
				eventId,
				participantId: user._id,
				role,
			})
			setEmail('')
			setRole('viewer')
			toggleAddParticipantModal()
		} else {
			toast.error('User not found with the provided email.')
		}
	}

	return (
		<AnimatePresence>
			<Activity mode={isOpen ? 'visible' : 'hidden'}>
				{/* Backdrop */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={toggleAddParticipantModal}
					className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
				/>

				{/* Modal */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95, y: 20 }}
					transition={{ type: 'spring', damping: 30, stiffness: 300 }}
					className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded z-50 overflow-hidden"
				>
					{/* Header */}
					<div className="relative p-6 border-b border-border">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center">
									<UserPlus className="w-5 h-5 text-primary-foreground" />
								</div>
								<div>
									<h2>Add Participant</h2>
									<p className="text-sm text-muted-foreground">
										Enter the email of the user to add.
									</p>
								</div>
							</div>
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={toggleAddParticipantModal}
								className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
							>
								<X className="w-5 h-5" />
							</motion.button>
						</div>
					</div>

					{/* Content */}
					<div className="p-6">
						<div className="space-y-4">
							<div>
								<label htmlFor="email" className="block mb-2">
									Email
								</label>
								<input
									type="email"
									name="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="user@example.com"
									className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>
							<div>
								<label htmlFor="role" className="block mb-2">
									Role
								</label>
								<div className="flex gap-4">
									<motion.button
										type="button"
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() => setRole('editor')}
										className={`flex-1 p-3 border-2 rounded transition-all ${
											role === 'editor'
												? 'border-primary bg-primary/10'
												: 'border-border hover:border-primary/50'
										}`}
									>
										Editor
									</motion.button>
									<motion.button
										type="button"
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() => setRole('viewer')}
										className={`flex-1 p-3 border-2 rounded transition-all ${
											role === 'viewer'
												? 'border-primary bg-primary/10'
												: 'border-border hover:border-primary/50'
										}`}
									>
										Viewer
									</motion.button>
								</div>
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className="p-6 border-t border-border flex justify-end gap-4">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={toggleAddParticipantModal}
							className="px-6 py-3 border border-border rounded hover:border-primary transition-colors"
						>
							Cancel
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleSubmit}
							disabled={!email}
							className="px-6 py-3 bg-primary text-primary-foreground rounded disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Add Participant
						</motion.button>
					</div>
				</motion.div>
			</Activity>
		</AnimatePresence>
	)
}
