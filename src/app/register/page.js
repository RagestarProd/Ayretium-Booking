"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function RegisterPage() {
	const [email, setEmail] = useState("")
	const [name, setName] = useState("")
	const [password, setPassword] = useState("")
	const router = useRouter()

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const res = await fetch("/api/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, name, password }),
			})
			if (!res.ok) throw new Error("Failed to register")
			toast.success("Registration successful! Please log in.")
			router.push("/login")
		} catch (error) {
			toast.error(error.message)
		}
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-center text-2xl font-semibold"><img src="/logo.png" alt="Logo" className="m-auto" />Login</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 space-y-4">
						<h1 className="text-xl font-bold">Register</h1>
						<Input
							type="email"
							placeholder="Email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							required
						/>
						<Input
							type="text"
							placeholder="Name"
							value={name}
							onChange={e => setName(e.target.value)}
							required
						/>
						<Input
							type="password"
							placeholder="Password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
						/>
						<Button type="submit">Register</Button>
					</form></CardContent>
			</Card>
		</main>
	)
}
