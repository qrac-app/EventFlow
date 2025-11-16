import { atom } from 'nanostores'

export const aiDrawerStore = atom<{
	isOpen: boolean
}>({
	isOpen: false,
})

export const toggleAIDrawer = () => {
	const currentState = aiDrawerStore.get().isOpen

	aiDrawerStore.set({ isOpen: !currentState })
}
