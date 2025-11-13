import { useMutation, useQuery } from 'convex/react'
import { ArrowDown, ArrowUp, X } from 'lucide-react'
import { motion } from 'motion/react'
import { Activity } from 'react'

import { api } from '~/convex/_generated/api'
import type { Id } from '~/convex/_generated/dataModel'

interface ParticipantsListProps {
	eventId: Id<'events'>
}

export function ParticipantsList({ eventId }: ParticipantsListProps) {
	const participants = useQuery(api.participants.getParticipantsByEvent, {
		eventId,
	})
	const removeParticipant = useMutation(api.participants.removeParticipant)
	const updateParticipantRole = useMutation(
		api.participants.updateParticipantRole,
	)

	const handleRemove = (participantId: Id<'participants'>) => {
		removeParticipant({ eventId, participantId })
	}

	const handlePromote = (participantId: Id<'participants'>) => {
		updateParticipantRole({ participantId, role: 'editor' })
	}

	const handleDemote = (participantId: Id<'participants'>) => {
		updateParticipantRole({ participantId, role: 'viewer' })
	}

	return (
		<div className="mt-8">
			<h2 className="text-2xl font-bold mb-4">
				Participants ({participants?.length || 0})
			</h2>
			<div className="space-y-4">
				{participants?.map((p) =>
					p ? (
						<motion.div
							key={p._id}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className="flex items-center justify-between p-4 bg-card/50 border border-border rounded"
						>
							<div className="flex items-center gap-4">
								<img
									src={p.user?.avatar}
									alt={p.user?.name}
									className="w-10 h-10 rounded-full"
								/>
								<div>
									<p className="font-medium">{p.user?.name}</p>
									<p className="text-sm text-muted-foreground">
										{p.user?.email}
									</p>
									<p className="text-xs text-primary capitalize">{p.role}</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Activity mode={p.role === 'viewer' ? 'visible' : 'hidden'}>
									<motion.button
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={() => handlePromote(p._id)}
										className="p-2 rounded-full hover:bg-primary/20"
									>
										<ArrowUp className="w-5 h-5 text-primary" />
									</motion.button>
								</Activity>

								<Activity
									mode={
										['viewer', 'owner'].includes(p.role) ? 'hidden' : 'visible'
									}
								>
									<motion.button
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={() => handleDemote(p._id)}
										className="p-2 rounded-full hover:bg-primary/20"
									>
										<ArrowDown className="w-5 h-5 text-primary" />
									</motion.button>
								</Activity>

								<Activity mode={p.role === 'owner' ? 'hidden' : 'visible'}>
									<motion.button
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={() => handleRemove(p._id)}
										className="p-2 rounded-full hover:bg-destructive/20"
									>
										<X className="w-5 h-5 text-destructive" />
									</motion.button>
								</Activity>
							</div>
						</motion.div>
					) : null,
				)}
			</div>
		</div>
	)
}
