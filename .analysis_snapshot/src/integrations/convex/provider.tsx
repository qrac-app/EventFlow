import { useAuth } from '@clerk/clerk-react'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string
if (!CONVEX_URL) {
	console.error('missing envar CONVEX_URL')
}

const convex = new ConvexReactClient(CONVEX_URL)
const convexQueryClient = new ConvexQueryClient(convex)

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryKeyHashFn: convexQueryClient.hashFn(),
			queryFn: convexQueryClient.queryFn(),
		},
	},
})

convexQueryClient.connect(queryClient)

export function getConvexContext() {
	return { convexQueryClient, queryClient }
}

export default function AppConvexProvider({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</ConvexProviderWithClerk>
	)
}
