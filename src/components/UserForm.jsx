"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { toast } from "sonner";
import { IconUser, IconSettings, IconShieldCheck, IconCheck } from '@tabler/icons-react'

const roles = [
	{
		id: 'user',
		title: 'User',
		description: 'Basic access to the system',
		icon: <IconUser className="w-4 h-4 mr-2 text-gray-500" />,
	},
	{
		id: 'manager',
		title: 'Manager',
		description: 'Manage team and projects',
		icon: <IconSettings className="w-4 h-4 mr-2 text-gray-600" />,
	},
	{
		id: 'admin',
		title: 'Admin',
		description: 'Full administrative access',
		icon: <IconShieldCheck className="w-4 h-4 mr-2 text-gray-700" />,
	},
]

export default function UserForm({ initialData }) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [userRole, setUserRole] = useState('')

	const selectedRole = roles.find((r) => r.id === userRole)

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);

		const form = e.currentTarget;
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());
		data.role = userRole

		// Decide method and URL based on initialData presence
		const method = initialData ? "PUT" : "POST";
		const url = initialData ? `/api/users/${initialData.current_id}/` : "/api/users";

		const res = await fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		setLoading(false);

		if (res.ok) {
			toast.success(initialData ? "User updated successfully" : "New user successfully added");
			router.push("/dashboard/users");
		} else {
			const errData = await res.json();
			toast.error(errData.error?.message || "Failed to save user");
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4 max-w-xl p-4 pt-0">
			<div className="space-y-2">
				<Label htmlFor="name">Display Name</Label>
				<span className="text-xs text-muted-foreground">
					How the user is referred to in the app.
				</span>
				<Input
					name="name"
					placeholder="Name"
					required
					defaultValue={initialData?.name || ""}
					id="name"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="email">Email Address</Label>
				<span className="text-xs text-muted-foreground">
					Users will login using their email.
				</span>
				<Input
					type="email"
					name="email"
					placeholder="Email"
					required
					defaultValue={initialData?.email || ""}
					id="email"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="password" className="mb-0 pb-0">Password</Label>
				<span className="text-xs text-muted-foreground">
					User will be required to set new password upon first login.
				</span>
				<Input
					type="text"
					name="password"
					placeholder="Password"
					required
					id="password"
				/>
			</div>

			<div className="space-y-2">
				<Label>Role</Label>
				<Select value={userRole} onValueChange={setUserRole}>
					<SelectTrigger className="flex items-center gap-2">
						<SelectValue placeholder="Select Role" />
					</SelectTrigger>

					<SelectContent className="bg-sidebar-foreground border-background">
						<SelectGroup>
							{roles.map((role) => (
								<SelectItem
									key={role.id}
									value={role.id}
									className="flex flex-col items-start"
								>
									<div className="flex items-center">
										{role.icon}
										<span className="font-medium text-foreground">{role.title}</span>
									</div>
									<span className="text-xs text-muted-foreground ml-2">
										{role.description}
									</span>
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<Button type="submit" disabled={loading || userRole === 'sel'}>
				{loading ? (initialData ? "Updating..." : "Adding...") : (initialData ? "Update User" : "Add User")}
			</Button>
		</form>
	);
}
