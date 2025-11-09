import { atom } from 'nanostores'

import type { Event } from '@/types'

export const eventFormModalStore = atom<{
	isOpen: boolean
	event: Event | null
}>({
	isOpen: false,
	event: null,
})

export const toggleEventFormModal = (event: Event | null = null) => {
	const currentState = eventFormModalStore.get().isOpen

	console.log(
		'Toggling event form modal. Current state:',
		currentState,
		'Event:',
		event,
	)

	eventFormModalStore.set({ isOpen: !currentState, event })
}
