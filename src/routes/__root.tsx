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

import { seo } from '@/lib/seo'

import ClerkProvider from '../integrations/clerk/provider'
import ConvexProvider, {
	getConvexContext,
} from '../integrations/convex/provider'
import appCss from '../styles.css?url'

const { convexQueryClient, queryClient } = getConvexContext()

export const Route = createRootRouteWithContext<{
	convexQueryClient: typeof convexQueryClient
	queryClient: typeof queryClient
}>()({
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
	shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<head>
				<HeadContent />
			</head>
			<body>
				<ConvexProvider>
					<ClerkProvider>
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
					</ClerkProvider>
				</ConvexProvider>
				<Scripts />
			</body>
		</html>
	)
}
