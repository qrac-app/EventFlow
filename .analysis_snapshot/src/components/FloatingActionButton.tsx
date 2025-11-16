import { Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

interface FloatingActionButtonProps {
	onClick: () => void
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
	const [isHovered, setIsHovered] = useState(false)

	return (
		<motion.button
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			exit={{ scale: 0 }}
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.9 }}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			onClick={onClick}
			className="fixed bottom-8 right-8 w-16 h-16 bg-linear-to-br from-primary to-secondary text-primary-foreground rounded-full shadow-2xl z-40 flex items-center justify-center overflow-hidden"
		>
			{/* Ripple effect */}
			<motion.div
				className="absolute inset-0 bg-primary"
				animate={{
					scale: [1, 2, 1],
					opacity: [0.5, 0, 0.5],
				}}
				transition={{
					duration: 2,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
			/>

			{/* Icon */}
			<AnimatePresence mode="wait">
				<motion.div
					key={isHovered ? 'hovered' : 'normal'}
					initial={{ rotate: -90, opacity: 0 }}
					animate={{ rotate: 0, opacity: 1 }}
					exit={{ rotate: 90, opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="relative z-10"
				>
					{isHovered ? (
						<Plus className="w-6 h-6" />
					) : (
						<Plus className="w-6 h-6" />
					)}
				</motion.div>
			</AnimatePresence>

			{/* Glow */}
			<motion.div
				className="absolute inset-0 bg-linear-to-br from-primary to-secondary blur-xl opacity-50"
				animate={{
					scale: isHovered ? 1.5 : 1,
					opacity: isHovered ? 0.8 : 0.5,
				}}
			/>
		</motion.button>
	)
}
