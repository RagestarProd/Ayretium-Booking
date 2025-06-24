"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function LoginPage() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	function handleSubmit(e) {
		e.preventDefault()
		if (!email || !password) {
			toast.error("Please enter any email and any password.")
			return
		}
		setLoading(true)
		setTimeout(() => {
			setLoading(false)
			router.push("/")
		}, 1000)
	}

	return (
		<main className="flex min-h-screen items-center justify-center px-4">
			<Card className="w-full max-w-md bg-secondary">
				<CardHeader className="pb-6">
					<CardTitle className="text-center text-2xl font-semibold">
						<img src="/logo.png" alt="Logo" className="m-auto" />Login</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-1">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
							/>
						</div>

						<div className="space-y-1">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Your password"
							/>
						</div>

						<div className="space-y-1">
							<Button type="submit" disabled={loading} className="w-full">
								{loading ? "Logging in..." : "Login"}
							</Button>

							<Button variant="link" disabled={loading} className="w-full">
								Forgot password
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</main>
	)
}
