import { auth } from '@clerk/tanstack-react-start/server'
import { createServerFn } from '@tanstack/react-start'

export const getUserId = createServerFn({ method: 'GET' }).handler(async () => {
	const { userId, isAuthenticated } = await auth()

	return {
		userId,
		isAuthenticated,
	}
})
