import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import prisma from '@/lib/prisma'


export const authOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email", placeholder: "your@email.com" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Missing email or password")
				}

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
					select: {
						id: true,
						email: true,
						password: true,
						name: true,
						role: true,
					},
				})

				if (!user) {
					throw new Error("No user found")
				}

				const isValid = await bcrypt.compare(credentials.password, user.password)
				if (!isValid) {
					throw new Error("Incorrect password")
				}

				return {
					id: user.id,
					name: user.name,
					email: user.email,
					role: user.role,
				}
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/login",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id
				token.role = user.role
			}
			return token
		},
		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.id
				session.user.role = token.role
			}
			return session
		},
	},
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
