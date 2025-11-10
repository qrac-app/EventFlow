import { Users } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Id } from '~/convex/_generated/dataModel'

interface ActiveUser {
	id: Id<'users'>
	name: string
	avatar: string
	lastSeen: string
}

interface ActiveUsersProps {
	users: ActiveUser[]
	currentUserId?: string
}

const colors = [
	'from-blue-500 to-blue-600',
	'from-purple-500 to-purple-600',
	'from-pink-500 to-pink-600',
	'from-green-500 to-green-600',
	'from-yellow-500 to-yellow-600',
	'from-red-500 to-red-600',
]

export function ActiveUsers({ users, currentUserId }: ActiveUsersProps) {
	const otherUsers = users.filter((u) => u.id !== currentUserId)

	if (otherUsers.length === 0) return null

	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full"
		>
			<div className="flex items-center gap-1 text-sm">
				<Users className="w-4 h-4 text-primary" />
				<span className="text-primary">Live now:</span>
			</div>

			<div className="flex -space-x-2">
				<AnimatePresence>
					{otherUsers.slice(0, 5).map((user, index) => (
						<motion.div
							key={user.id}
							initial={{ scale: 0, x: -10 }}
							animate={{ scale: 1, x: 0 }}
							exit={{ scale: 0, x: 10 }}
							transition={{ delay: index * 0.1 }}
							whileHover={{ scale: 1.2, zIndex: 10 }}
							className="relative group"
						>
							{/* Avatar */}
							<div
								className={`w-8 h-8 rounded-full bg-linear-to-br ${
									colors[index % colors.length]
								} border-2 border-background flex items-center justify-center text-white text-xs relative`}
							>
								{user.name.charAt(0).toUpperCase()}

								{/* Pulse indicator */}
								<motion.div
									className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"
									animate={{
										scale: [1, 1.2, 1],
										opacity: [1, 0.8, 1],
									}}
									transition={{
										duration: 2,
										repeat: Infinity,
									}}
								/>
							</div>

							{/* Tooltip */}
							<div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
								<div className="px-3 py-1.5 bg-card border border-border rounded shadow-lg text-sm">
									{user.name}
								</div>
							</div>
						</motion.div>
					))}
				</AnimatePresence>

				{otherUsers.length > 5 && (
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs"
					>
						+{otherUsers.length - 5}
					</motion.div>
				)}
			</div>
		</motion.div>
	)
}
