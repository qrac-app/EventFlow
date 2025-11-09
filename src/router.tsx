import * as Sentry from '@sentry/tanstackstart-react'
import { createRouter } from '@tanstack/react-router'

import { DefaultCatchBoundary } from './components/DefaultCatchBoundary'
import { NotFound } from './components/NotFound'

import { getConvexContext } from './integrations/convex/provider'

import { routeTree } from './routeTree.gen'

export const getRouter = () => {
	const { convexQueryClient, queryClient } = getConvexContext()

	const router = createRouter({
		routeTree,
		defaultPreload: 'intent',
		context: { convexQueryClient, queryClient, userId: null },
		defaultErrorComponent: DefaultCatchBoundary,
		defaultNotFoundComponent: () => <NotFound />,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
	})

	if (!router.isServer) {
		Sentry.init({
			dsn: import.meta.env.VITE_SENTRY_DSN,
			integrations: [],
		})
	}

	return router
}
