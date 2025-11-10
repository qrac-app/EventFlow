import { useStore } from '@nanostores/react'
import { useMutation, useQuery } from 'convex/react'
import { Loader2, Send, Sparkles, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Activity, useEffect, useEffectEvent, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import { aiDrawerStore, toggleAIDrawer } from '@/stores/ai-drawer'

import { api } from '~/convex/_generated/api'
import type { Id } from '~/convex/_generated/dataModel'

export function AIDrawer({ eventId }: { eventId: Id<'events'> }) {
	const { isOpen } = useStore(aiDrawerStore)
	const [input, setInput] = useState('')

	const messages = useQuery(api.ai.getMessages, {
		eventId: eventId as Id<'events'>,
	})
	const user = useQuery(api.users.getCurrentUser)
	const sendMessage = useMutation(api.ai.sendMessage)

	const isGenerating = messages === undefined

	const messagesEndRef = useRef<HTMLDivElement>(null)

	const scrollToBottom = useEffectEvent(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	})

	// biome-ignore lint/correctness/useExhaustiveDependencies: <FEEDBACK>missing dependeny 'scrollToBottom'</FEEDBACK>
	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const handleSend = async () => {
		if (!input.trim() || isGenerating) return

		const messageContent = input
		setInput('')

		await sendMessage({
			eventId: eventId as Id<'events'>,
			content: messageContent,
			role: 'user',
		})
	}

	const quickPrompts = [
		'Generate 2-hour workshop',
		'Add coffee break',
		'Suggest team activities',
		'Make it more casual',
	]

	return (
		<AnimatePresence>
			<Activity mode={isOpen ? 'visible' : 'hidden'}>
				{/* Backdrop */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={toggleAIDrawer}
					className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
				/>

				{/* Drawer */}
				<motion.div
					initial={{ x: '100%' }}
					animate={{ x: 0 }}
					exit={{ x: '100%' }}
					transition={{ type: 'spring', damping: 30, stiffness: 300 }}
					className="fixed top-0 right-0 bottom-0 w-full md:w-[800px] bg-card border-l border-border z-50 flex flex-col"
				>
					{/* Header */}
					<div className="flex items-center justify-between p-6 border-b border-border">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center">
								<Sparkles className="w-5 h-5 text-primary-foreground" />
							</div>
							<div>
								<h3>AI Assistant</h3>
								<p className="text-sm text-muted-foreground">
									Smart agenda generation
								</p>
							</div>
						</div>
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={toggleAIDrawer}
							className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
						>
							<X className="w-5 h-5" />
						</motion.button>
					</div>

					{/* Messages */}
					<div className="flex-1 overflow-y-auto p-6 space-y-4">
						<AnimatePresence initial={false}>
							{messages?.map((message) => (
								<motion.div
									key={message._id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									className={`flex gap-3 ${
										message.role === 'user' ? 'justify-end' : 'justify-start'
									}`}
								>
									{message.role === 'assistant' && (
										<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
											<Sparkles className="w-4 h-4 text-primary-foreground" />
										</div>
									)}
									<div
										className={`max-w-[80%] rounded p-4 ${
											message.role === 'user'
												? 'bg-primary text-primary-foreground'
												: 'bg-accent text-accent-foreground'
										}`}
									>
										{message.role === 'user' && message.user?.name && (
											<p className="text-xs font-bold mb-1">
												{message.user.name}
											</p>
										)}
										<div className="prose prose-sm max-w-none">
											<ReactMarkdown>{message.content}</ReactMarkdown>
										</div>
										<span className="text-xs opacity-70 mt-2 block">
											{new Date(message._creationTime).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
											})}
										</span>
									</div>

									{message.role === 'user' && user?.avatar && (
										<img
											src={user.avatar}
											alt={user.name}
											className="w-8 h-8 rounded-full"
										/>
									)}
								</motion.div>
							))}
						</AnimatePresence>
						<div ref={messagesEndRef} />

						{/* Loading indicator */}
						{isGenerating && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="flex justify-start"
							>
								<div className="bg-accent rounded p-4 flex items-center gap-2">
									<motion.div
										animate={{ rotate: 360 }}
										transition={{
											duration: 2,
											repeat: Infinity,
											ease: 'linear',
										}}
									>
										<Loader2 className="w-4 h-4" />
									</motion.div>
									<span>Generating agenda...</span>
								</div>
							</motion.div>
						)}
					</div>

					{/* Quick prompts */}
					<div className="px-6 py-3 border-t border-border">
						<p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
						<div className="flex flex-wrap gap-2">
							{quickPrompts.map((prompt) => (
								<motion.button
									key={prompt}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => setInput(prompt)}
									className="px-3 py-1.5 bg-accent hover:bg-accent/80 rounded-full text-xs transition-colors"
								>
									{prompt}
								</motion.button>
							))}
						</div>
					</div>

					{/* Input */}
					<div className="p-6 border-t border-border">
						<div className="flex gap-2">
							<input
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyPress={(e) => e.key === 'Enter' && handleSend()}
								placeholder="Describe what you need..."
								className="flex-1 px-4 py-3 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
								disabled={isGenerating}
							/>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleSend}
								disabled={!input.trim() || isGenerating}
								className="px-6 py-3 bg-primary text-primary-foreground rounded disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<Send className="w-5 h-5" />
							</motion.button>
						</div>
					</div>
				</motion.div>
			</Activity>
		</AnimatePresence>
	)
}
