'use client'

import { useMutation } from 'convex/react'
import { throttle } from 'lodash-es'
import { useEffect } from 'react'

import { api } from '~/convex/_generated/api'
import type { Id } from '~/convex/_generated/dataModel'

export function usePresence(
	eventId: Id<'events'>,
	userId: Id<'users'> | undefined,
) {
	const updatePresence = useMutation(api.participants.updatePresence)

	useEffect(() => {
		const update = () => {
			if (userId) {
				updatePresence({ eventId, userId })
			}
		}

		const throttledUpdate = throttle(update, 30000) // Update every 30 seconds

		window.addEventListener('mousemove', throttledUpdate)
		window.addEventListener('keydown', throttledUpdate)

		// Initial update
		update()

		return () => {
			window.removeEventListener('mousemove', throttledUpdate)
			window.removeEventListener('keydown', throttledUpdate)
		}
	}, [eventId, userId, updatePresence])
}
