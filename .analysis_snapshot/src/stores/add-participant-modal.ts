import { atom } from 'nanostores'

export const addParticipantModalStore = atom({
	isOpen: false,
})

export function toggleAddParticipantModal() {
	addParticipantModalStore.set({
		isOpen: !addParticipantModalStore.get().isOpen,
	})
}
