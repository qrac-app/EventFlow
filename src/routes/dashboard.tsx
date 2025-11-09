import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import React from 'react'

export const Route = createFileRoute('/dashboard')({
	component: DashboardLayout,
})

function DashboardLayout() {
	return (
		<React.Fragment>
			<Nav />
			<Outlet />
		</React.Fragment>
	)
}

const Nav = () => {
	return (
		<motion.nav
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-md border-b border-border"
		>
			<div className="max-w-7xl mx-auto px-6 py-4">
				<div className="flex items-center justify-between">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Link to="/" className="flex items-center gap-2 group">
							<motion.div
								className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center"
								whileHover={{ rotate: 180 }}
								transition={{ duration: 0.5 }}
							>
								<Sparkles className="w-5 h-5 text-primary-foreground" />
							</motion.div>
							<div className="flex items-start flex-col">
								<div className="font-mono">EventFlow</div>
								<div className="text-xs text-muted-foreground">
									AI Event Planner
								</div>
							</div>
						</Link>
					</motion.button>
				</div>
			</div>
		</motion.nav>
	)
}
