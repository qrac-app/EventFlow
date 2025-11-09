import { ConvexQueryClient } from '@convex-dev/react-query'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConvexProvider, ConvexReactClient } from 'convex/react'

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string
if (!CONVEX_URL) {
	console.error('missing envar CONVEX_URL')
}

const convex = new ConvexReactClient(CONVEX_URL)
const queryClient = new QueryClient()
const convexQueryClient = new ConvexQueryClient(convex)

export function getConvexContext() {
	return { convexQueryClient, queryClient }
}

export default function AppConvexProvider({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<QueryClientProvider client={queryClient}>
			<ConvexProvider client={convexQueryClient.convexClient}>
				{children}
			</ConvexProvider>
		</QueryClientProvider>
	)
}
