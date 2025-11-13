import { atom } from 'nanostores'

export const agendaItemStore = atom<{
	isOpen: boolean
}>({
	isOpen: false,
})

export const toggleAgendaItem = () => {
	const currentState = agendaItemStore.get().isOpen

	agendaItemStore.set({ isOpen: !currentState })
}
