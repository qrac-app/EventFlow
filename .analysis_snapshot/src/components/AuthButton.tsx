import { SignInButton } from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react'
import type { ComponentType } from 'react'

export const AuthButton = ({
	text = 'Get Started',
	icon: Icon,
	className = '',
}: {
	text?: string
	icon?: ComponentType<{ className?: string }>
	className?: string
}) => {
	const content = (
		<>
			{text}
			{Icon && (
				<Icon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
			)}
		</>
	)

	return (
		<>
			<Authenticated>
				<Link to="/dashboard" className={className}>
					{content}
				</Link>
			</Authenticated>
			<Unauthenticated>
				<SignInButton>
					<p className={className}>{content}</p>
				</SignInButton>
			</Unauthenticated>
			<AuthLoading>
				<p className={className}>Loading...</p>
			</AuthLoading>
		</>
	)
}
