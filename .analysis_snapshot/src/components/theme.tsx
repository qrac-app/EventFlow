import { Moon, Sun } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

export const ThemeButton = () => {
	const [isDark, setIsDark] = useState(false)

	useEffect(() => {
		const theme = document.documentElement.classList.contains('dark')
		setIsDark(theme)
	}, [])

	const toggleTheme = () => {
		const newTheme = !isDark
		setIsDark(newTheme)
		if (newTheme) {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}

	return (
		<motion.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			onClick={toggleTheme}
			className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary transition-colors"
		>
			<AnimatePresence mode="wait">
				{isDark ? (
					<motion.div
						key="sun"
						initial={{ rotate: -90, opacity: 0 }}
						animate={{ rotate: 0, opacity: 1 }}
						exit={{ rotate: 90, opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						<Sun className="w-5 h-5" />
					</motion.div>
				) : (
					<motion.div
						key="moon"
						initial={{ rotate: 90, opacity: 0 }}
						animate={{ rotate: 0, opacity: 1 }}
						exit={{ rotate: -90, opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						<Moon className="w-5 h-5" />
					</motion.div>
				)}
			</AnimatePresence>
		</motion.button>
	)
}
