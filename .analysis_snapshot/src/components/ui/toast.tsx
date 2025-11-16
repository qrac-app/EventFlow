import { CheckCircle, Info, X, XCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
	message: string
	type: ToastType
	isVisible: boolean
	onClose: () => void
	duration?: number
}

export function Toast({
	message,
	type,
	isVisible,
	onClose,
	duration = 3000,
}: ToastProps) {
	useEffect(() => {
		if (isVisible && duration > 0) {
			const timer = setTimeout(() => {
				onClose()
			}, duration)

			return () => clearTimeout(timer)
		}
	}, [isVisible, duration, onClose])

	const icons = {
		success: CheckCircle,
		error: XCircle,
		info: Info,
	}

	const colors = {
		success: 'from-green-500 to-emerald-500',
		error: 'from-red-500 to-rose-500',
		info: 'from-blue-500 to-cyan-500',
	}

	const Icon = icons[type]

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, y: -100, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -100, scale: 0.95 }}
					transition={{ type: 'spring', damping: 25, stiffness: 300 }}
					className="fixed top-6 right-6 z-100 max-w-md"
				>
					<div className="bg-card border border-border rounded shadow-2xl overflow-hidden">
						<div className={`h-1 bg-linear-to-r ${colors[type]}`} />
						<div className="p-4 flex items-start gap-3">
							<div
								className={`w-10 h-10 rounded-full bg-linear-to-br ${colors[type]} flex items-center justify-center shrink-0`}
							>
								<Icon className="w-5 h-5 text-white" />
							</div>
							<p className="flex-1 pt-2">{message}</p>
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={onClose}
								className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-accent transition-colors hrink-0"
							>
								<X className="w-4 h-4" />
							</motion.button>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
