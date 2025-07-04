'use client'

import UserForm from "@/components/UserForm";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

export default function NewUserPage() {
	return (
		<div className="p-6 max-w-xl">
			<Card className="shadow-xs border rounded-lg">
				<CardHeader>
					<CardTitle className="text-2xl">Add User</CardTitle>
					<CardDescription>
						Fill in the details to add a new user.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<UserForm />
				</CardContent>
			</Card>
		</div>
	)
}
