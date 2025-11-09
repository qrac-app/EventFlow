import { useStore } from '@nanostores/react'
import { Loader2, Send, Sparkles, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Activity, useState } from 'react'

import { aiDrawerStore, toggleAIDrawer } from '@/stores/ai-drawer'

interface AIDrawerProps {
	onGenerate: (prompt: string) => void
}

interface Message {
	id: string
	role: 'user' | 'assistant'
	content: string
	timestamp: Date
}

export function AIDrawer({ onGenerate }: AIDrawerProps) {
	const { isOpen } = useStore(aiDrawerStore)

	const [messages, setMessages] = useState<Message[]>([
		{
			id: '1',
			role: 'assistant',
			content:
				'Hi! I can help you create or modify your event agenda. Try asking me to:\n\n• Generate a 2-hour design sprint\n• Add a networking break\n• Suggest icebreaker activities\n• Rebalance the timing',
			timestamp: new Date(),
		},
	])
	const [input, setInput] = useState('')
	const [isGenerating, setIsGenerating] = useState(false)

	const handleSend = async () => {
		if (!input.trim() || isGenerating) return

		const userMessage: Message = {
			id: Date.now().toString(),
			role: 'user',
			content: input,
			timestamp: new Date(),
		}

		setMessages((prev) => [...prev, userMessage])
		setInput('')
		setIsGenerating(true)

		// Simulate AI response
		setTimeout(() => {
			const aiMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				content: `I'll help you with that! Generating agenda items based on: "${input}"\n\nI've added new items to your timeline. You can drag to reorder them or click to edit details.`,
				timestamp: new Date(),
			}
			setMessages((prev) => [...prev, aiMessage])
			setIsGenerating(false)
			onGenerate(input)
		}, 2000)
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
					className="fixed top-0 right-0 bottom-0 w-full md:w-[500px] bg-card border-l border-border z-50 flex flex-col"
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
							{messages.map((message) => (
								<motion.div
									key={message.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									className={`flex ${
										message.role === 'user' ? 'justify-end' : 'justify-start'
									}`}
								>
									<div
										className={`max-w-[80%] rounded p-4 ${
											message.role === 'user'
												? 'bg-primary text-primary-foreground'
												: 'bg-accent text-accent-foreground'
										}`}
									>
										<p className="whitespace-pre-line">{message.content}</p>
										<span className="text-xs opacity-70 mt-2 block">
											{message.timestamp.toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
											})}
										</span>
									</div>
								</motion.div>
							))}
						</AnimatePresence>

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
