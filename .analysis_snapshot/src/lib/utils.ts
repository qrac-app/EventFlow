import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
	const date = new Date(dateString)
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	})
}

export function formatTime(dateString: string) {
	const date = new Date(dateString)
	return date.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
	})
}

export function getDaysUntil(dateString: string) {
	const now = new Date()
	const target = new Date(dateString)
	const diffTime = target.getTime() - now.getTime()
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
	return diffDays
}
