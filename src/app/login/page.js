"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
	const router = useRouter()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)

	async function handleSubmit(e) {
		e.preventDefault()
		setLoading(true)

		const res = await signIn("credentials", {
			redirect: false,
			email,
			password,
		})

		setLoading(false)

		if (res?.error) {
			toast.error(res.error)
		} else {
			toast.success("Logged in successfully!")
			router.push("/dashboard")  // Redirect to dashboard or homepage
		}
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-center text-2xl font-semibold"><img src="/logo.png" alt="Logo" className="m-auto" />Login</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
							/>
						</div>

						<div>
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Your password"
							/>
						</div>

						<Button type="submit" disabled={loading} className="w-full">
							{loading ? "Logging in..." : "Login"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</main>
	)
}