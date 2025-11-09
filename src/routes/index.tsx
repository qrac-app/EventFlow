import { createFileRoute } from '@tanstack/react-router'
import {
	ArrowRight,
	BarChart3,
	Brain,
	CheckCircle,
	Plus,
	Sparkles,
	Users,
	Users2,
	Zap,
} from 'lucide-react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

import { AuthButton } from '@/components/AuthButton'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

const phases = [
	{
		id: 'create',
		title: 'Create',
		description: 'Define your event parameters and goals',
		icon: Plus,
		color: 'from-chart-1 to-chart-2',
	},
	{
		id: 'generate',
		title: 'Generate',
		description: 'AI crafts an intelligent agenda',
		icon: Sparkles,
		color: 'from-chart-2 to-chart-3',
	},
	{
		id: 'vote',
		title: 'Vote',
		description: 'Team collaborates and refines',
		icon: Users,
		color: 'from-chart-3 to-primary',
	},
	{
		id: 'finalize',
		title: 'Finalize',
		description: 'Lock in and share your perfect event',
		icon: CheckCircle,
		color: 'from-primary to-secondary',
	},
]

const features = [
	{
		icon: Brain,
		title: 'AI-Powered Generation',
		description:
			'Let AI create intelligent agendas based on your event goals and preferences.',
		color: 'from-chart-2 to-chart-3',
	},
	{
		icon: Users2,
		title: 'Real-Time Collaboration',
		description:
			'Team members vote, suggest changes, and refine the agenda together.',
		color: 'from-chart-1 to-chart-2',
	},
	{
		icon: Zap,
		title: 'Dynamic Timeline',
		description:
			'Drag, drop, and resize agenda items with intuitive visual controls.',
		color: 'from-primary to-secondary',
	},
	{
		icon: BarChart3,
		title: 'Smart Insights',
		description:
			'Get analytics on voting patterns and optimize your event structure.',
		color: 'from-secondary to-chart-3',
	},
]

export const Route = createFileRoute('/')({
	pendingComponent: () => <LoadingSpinner />,
	component: Index,
})

function Index() {
	const containerRef = useRef<HTMLDivElement>(null)
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ['start end', 'end start'],
	})

	const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 1])
	const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 1])

	return (
		<motion.div
			key="landing"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="fixed inset-0 bg-linear-to-br from-primary/10 via-background to-secondary/10" />

			<motion.div
				className="fixed top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/20 blur-3xl pointer-events-none"
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
			<motion.div
				className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-secondary/20 blur-3xl pointer-events-none"
				animate={{
					scale: [1, 1.3, 1],
					opacity: [0.2, 0.4, 0.2],
				}}
				transition={{
					duration: 10,
					repeat: Infinity,
					ease: 'easeInOut',
					delay: 1,
				}}
			/>

			<div className="relative z-10">
				<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
					<div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							className="flex items-center justify-center gap-2 mb-6"
						>
							<Sparkles className="w-6 h-6 text-primary" />
							<span className="text-muted-foreground">
								AI-Powered Event Planning
							</span>
						</motion.div>

						<motion.h1
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.1 }}
							className="mb-6"
						>
							Plan smarter, together.
						</motion.h1>

						<motion.p
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="text-muted-foreground mb-12 max-w-2xl mx-auto"
						>
							Transform your events with AI-generated agendas, real-time
							collaboration, and intelligent scheduling. No more endless
							planning meetings.
						</motion.p>

						<motion.button
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.3 }}
							className="group relative px-8 py-4 bg-primary text-primary-foreground rounded overflow-hidden transition-all hover:scale-105 hover:shadow-xl"
						>
							<AuthButton
								text="Get Started"
								icon={ArrowRight}
								className="relative z-10 flex items-center gap-2"
							/>
							<motion.div
								className="absolute inset-0 bg-linear-to-r from-primary to-secondary"
								initial={{ x: '100%' }}
								whileHover={{ x: 0 }}
								transition={{ duration: 0.3 }}
							/>
						</motion.button>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1, duration: 0.8 }}
							className="absolute bottom-12 left-1/2 -translate-x-1/2"
						>
							<motion.div
								animate={{ y: [0, 10, 0] }}
								transition={{ duration: 2, repeat: Infinity }}
								className="w-6 h-10 border-2 border-foreground/20 rounded-full flex items-start justify-center p-2"
							>
								<motion.div
									animate={{ height: ['20%', '80%', '20%'] }}
									transition={{ duration: 2, repeat: Infinity }}
									className="w-1 bg-foreground/40 rounded-full"
								/>
							</motion.div>
						</motion.div>
					</div>
				</section>

				<section ref={containerRef} className="py-32 relative overflow-hidden">
					<div className="max-w-7xl mx-auto px-6">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-center mb-20"
						>
							<h2 className="mb-4">How it works</h2>
							<p className="text-muted-foreground max-w-2xl mx-auto">
								From concept to execution in four seamless steps
							</p>
						</motion.div>

						<div className="relative">
							<div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border" />
							<motion.div
								className="absolute top-1/2 left-0 h-0.5 bg-linear-to-r from-primary to-secondary origin-left"
								style={{
									scaleX: useTransform(scrollYProgress, [0.2, 0.8], [0, 1]),
									width: '100%',
								}}
							/>

							{/* Phase nodes */}
							<div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
								{phases.map((phase, index) => (
									<motion.div
										key={phase.id}
										initial={{ opacity: 0, y: 50 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5, delay: index * 0.1 }}
										className="relative"
									>
										{/* Node circle */}
										<motion.div
											whileHover={{ scale: 1.1 }}
											className="mx-auto w-24 h-24 rounded-full bg-linear-to-br flex items-center justify-center mb-6 relative"
											style={{
												backgroundImage: `linear-gradient(to bottom right, var(--color-${phase.color.split(' ')[0].replace('from-', '')}), var(--color-${phase.color.split(' ')[1].replace('to-', '')}))`,
											}}
										>
											{/* Glow effect */}
											<motion.div
												className="absolute inset-0 rounded-full blur-xl opacity-50"
												style={{
													backgroundImage: `linear-gradient(to bottom right, var(--color-primary), var(--color-secondary))`,
												}}
												animate={{
													scale: [1, 1.2, 1],
													opacity: [0.3, 0.6, 0.3],
												}}
												transition={{
													duration: 3,
													repeat: Infinity,
													delay: index * 0.5,
												}}
											/>

											<phase.icon className="w-10 h-10 text-primary-foreground relative z-10" />
										</motion.div>

										<div className="text-center">
											<h3 className="mb-2">{phase.title}</h3>
											<p className="text-muted-foreground">
												{phase.description}
											</p>
										</div>

										{/* Connector (desktop only) */}
										{index < phases.length - 1 && (
											<motion.div
												className="hidden md:block absolute top-12 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-0.5"
												initial={{ scaleX: 0 }}
												whileInView={{ scaleX: 1 }}
												viewport={{ once: true }}
												transition={{ duration: 0.8, delay: index * 0.2 }}
												style={{
													background:
														'linear-gradient(to right, var(--color-primary), var(--color-secondary))',
													originX: 0,
												}}
											/>
										)}
									</motion.div>
								))}
							</div>
						</div>
					</div>
				</section>

				<section ref={containerRef} className="py-32 relative overflow-hidden">
					<motion.div
						style={{ opacity, scale }}
						className="max-w-7xl mx-auto px-6"
					>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-center mb-20"
						>
							<h2 className="mb-4">Built for modern teams</h2>
							<p className="text-muted-foreground max-w-2xl mx-auto">
								Everything you need to plan, collaborate, and execute perfect
								events
							</p>
						</motion.div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{features.map((feature, index) => (
								<motion.div
									key={feature.title}
									initial={{ opacity: 0, y: 50 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
									whileHover={{ scale: 1.02 }}
									className="relative p-8 bg-card/50 backdrop-blur-sm border border-border rounded overflow-hidden group"
								>
									{/* Glow effect */}
									<motion.div
										className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
										style={{
											background: `linear-gradient(135deg, var(--color-primary)/10, var(--color-secondary)/10)`,
										}}
									/>

									{/* Icon */}
									<motion.div
										className="relative w-16 h-16 rounded-full bg-linear-to-br flex items-center justify-center mb-6"
										style={{
											backgroundImage: `linear-gradient(to bottom right, var(--color-primary), var(--color-secondary))`,
										}}
										whileHover={{ rotate: 360 }}
										transition={{ duration: 0.8 }}
									>
										<feature.icon className="w-8 h-8 text-primary-foreground" />
									</motion.div>

									<div className="relative z-10">
										<h3 className="mb-3">{feature.title}</h3>
										<p className="text-muted-foreground">
											{feature.description}
										</p>
									</div>

									{/* Corner accent */}
									<motion.div
										className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/20 to-transparent rounded-full blur-3xl"
										animate={{
											scale: [1, 1.2, 1],
											opacity: [0.3, 0.6, 0.3],
										}}
										transition={{
											duration: 4,
											repeat: Infinity,
											delay: index * 0.5,
										}}
									/>
								</motion.div>
							))}
						</div>
					</motion.div>
				</section>

				<motion.section
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					className="py-32 relative overflow-hidden"
				>
					<div className="relative z-10 max-w-3xl mx-auto text-center px-6">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="mb-6"
						>
							Ready to transform your events?
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 }}
							className="text-muted-foreground mb-8"
						>
							Join teams who are planning smarter with AI-powered agendas
						</motion.p>
						<motion.button
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2 }}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="px-8 py-4 bg-primary text-primary-foreground rounded shadow-lg hover:shadow-xl transition-shadow"
						>
							<AuthButton text="Get Started Now" />
						</motion.button>
					</div>
				</motion.section>
			</div>
		</motion.div>
	)
}
