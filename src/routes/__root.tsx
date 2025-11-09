import { TanStackDevtools } from '@tanstack/react-devtools'
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { AnimatePresence } from 'motion/react'

import { DefaultCatchBoundary } from '@/components/DefaultCatchBoundary'
import { NotFound } from '@/components/NotFound'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

import { getUserId } from '@/lib/auth'
import { seo } from '@/lib/seo'

import { AppClerkProvider as ClerkProvider } from '../integrations/clerk/provider'
import ConvexProvider, {
	getConvexContext,
} from '../integrations/convex/provider'
import appCss from '../styles.css?url'

const { convexQueryClient, queryClient } = getConvexContext()

export const Route = createRootRouteWithContext<{
	convexQueryClient: typeof convexQueryClient
	queryClient: typeof queryClient
	userId: string | null
}>()({
	pendingComponent: () => <LoadingSpinner />,
	beforeLoad: async ({ context }) => {
		const user = await context.queryClient.fetchQuery({
			queryKey: ['getUserId'],
			queryFn: getUserId,
		})

		return {
			userId: user.isAuthenticated ? user.userId : null,
		}
	},
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			...seo({
				title: 'EventFlow - AI-Assisted Event Planner',
				description:
					'Plan and manage events effortlessly with EventFlow, your AI-powered event planning assistant.',
			}),
		],
		links: [
			{
				rel: 'stylesheet',
				href: appCss,
			},
		],
	}),

	errorComponent: (props) => {
		return (
			<RootDocument>
				<DefaultCatchBoundary {...props} />
			</RootDocument>
		)
	},

	notFoundComponent: () => <NotFound />,
	shellComponent: RootComponent,
})

function RootComponent({ children }: { children: React.ReactNode }) {
	return (
		<ClerkProvider>
			<ConvexProvider>
				<RootDocument>{children}</RootDocument>
			</ConvexProvider>
		</ClerkProvider>
	)
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<head>
				<HeadContent />
			</head>
			<body>
				<AnimatePresence mode="wait">{children}</AnimatePresence>
				<TanStackDevtools
					config={{
						position: 'bottom-right',
					}}
					plugins={[
						{
							name: 'Tanstack Router',
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	)
}
