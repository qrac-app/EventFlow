import { motion } from 'motion/react'

export function LoadingSpinner() {
	return (
		<div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
			<motion.div
				className="relative w-20 h-20"
				animate={{ rotate: 360 }}
				transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
			>
				{/* Outer ring */}
				<motion.div
					className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full"
					animate={{ rotate: 360 }}
					transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
				/>

				{/* Inner ring */}
				<motion.div
					className="absolute inset-2 border-4 border-secondary/20 border-t-secondary rounded-full"
					animate={{ rotate: -360 }}
					transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
				/>

				{/* Center glow */}
				<motion.div
					className="absolute inset-4 bg-linear-to-br from-primary to-secondary rounded-full blur-lg"
					animate={{
						opacity: [0.3, 0.8, 0.3],
						scale: [0.8, 1.2, 0.8],
					}}
					transition={{
						duration: 2,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
				/>
			</motion.div>
		</div>
	)
}
