'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from "@/components/ui/select";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { IconUser, IconAt, IconKey, IconShieldCheck, IconBuildings, IconBuildingStore, IconSettings } from '@tabler/icons-react';
import { useEffect } from 'react';

import VenueGroupSelect from '@/components/VenueGroupSelect';
import VenueSelect from '@/components/VenueSelect';

const roles = [
	{ id: 'user', title: 'User', icon: <IconUser className="w-4 h-4 mr-2 text-gray-500" /> },
	{ id: 'manager', title: 'Manager', icon: <IconSettings className="w-4 h-4 mr-2 text-gray-600" /> },
	{ id: 'admin', title: 'Admin', icon: <IconShieldCheck className="w-4 h-4 mr-2 text-gray-700" /> },
];

export default function UserForm({ initialData, isLoading = false }) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	// Initialize state with initialData only once
	const [userRole, setUserRole] = useState(() => initialData?.role || '');
	const [venueGroupId, setVenueGroupId] = useState(() => initialData?.venueGroupId?.toString() || '');
	const [venueId, setVenueId] = useState(() => initialData?.venueId || null);


	useEffect(() => {
		if (initialData?.role) {
			setUserRole(initialData.role);
		}
		if (initialData?.venueGroupId) {
			setVenueGroupId(initialData.venueGroupId.toString());
		}
		if (initialData?.venueId) {
			setVenueId(initialData.venueId);
		}
	}, [initialData]);

	// Show loading skeleton while data is missing
	if (isLoading && initialData === null) {
		return (
			<div className="space-y-4 p-4">
				<Skeleton className="h-10 w-full rounded" />
				<Skeleton className="h-10 w-full rounded" />
				<Skeleton className="h-10 w-full rounded" />
				<Skeleton className="h-10 w-full rounded" />
				<Skeleton className="h-10 w-32 rounded mx-auto" />
			</div>
		);
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);

		const form = e.currentTarget;
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());
		data.role = userRole;
		data.venueGroupId = venueGroupId ? Number(venueGroupId) : null;
		data.venueId = venueId ? Number(venueId) : null;

		const method = initialData ? "PUT" : "POST";
		const url = initialData ? `/api/users/${initialData.id}` : "/api/users";

		try {
			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (res.ok) {
				toast.success(initialData ? "User updated" : "User added");
				router.push("/dashboard/users");
			} else {
				const errData = await res.json();
				toast.error(errData.error?.message || "Failed to save user");
			}
		} catch (error) {
			toast.error(error.message || "Unexpected error");
		} finally {
			setLoading(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="p-0">
			<Table>
				<TableBody>

					<TableRow className="border-t border-border px-4">
						<TableCell className="w-1/3 px-4 py-3">
							<Label htmlFor="name" className="flex items-center">
								<IconUser className="w-4 h-4 mr-2" /> Name
							</Label>
						</TableCell>
						<TableCell className="px-4 py-3">
							<Input name="name" required defaultValue={initialData?.name || ""} id="name" placeholder="Display Name" />
						</TableCell>
					</TableRow>

					<TableRow className="px-4">
						<TableCell className="px-4 py-3">
							<Label htmlFor="email" className="flex items-center">
								<IconAt className="w-4 h-4 mr-2" /> Email
							</Label>
						</TableCell>
						<TableCell className="px-4 py-3">
							<Input type="email" name="email" required defaultValue={initialData?.email || ""} id="email" placeholder="Email" />
						</TableCell>
					</TableRow>

					<TableRow className="px-4">
						<TableCell className="px-4 py-3">
							<Label htmlFor="password" className="flex items-center">
								<IconKey className="w-4 h-4 mr-2" /> Password
							</Label>
						</TableCell>
						<TableCell className="px-4 py-3">
							<Input type="text" name="password" id="password" placeholder="Password" />
						</TableCell>
					</TableRow>

					<TableRow className="px-4">
						<TableCell className="px-4 py-3">
							<Label className="flex items-center">
								<IconShieldCheck className="w-4 h-4 mr-2" /> Role
							</Label>
						</TableCell>
						<TableCell className="px-4 py-3">
							<Select value={userRole} onValueChange={setUserRole}>
								<SelectTrigger>
									<SelectValue placeholder="Select Role" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{roles.map((role) => (
											<SelectItem key={role.id} value={role.id}>
												<div className="flex items-center">
													{role.icon} {role.title}
												</div>
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</TableCell>
					</TableRow>

					<TableRow className="px-4">
						<TableCell colSpan={2} className="px-4 py-4">
							<div className="grid md:grid-cols-2 gap-4">
								<div className="flex items-center space-x-2">
									<IconBuildings className="w-5 h-5 text-gray-600" />
									<VenueGroupSelect value={venueGroupId} onChange={setVenueGroupId} />
								</div>
								<div className="flex items-center space-x-2">
									<IconBuildingStore className="w-5 h-5 text-gray-600" />
									<VenueSelect mode="singleselect" initialVenueId={initialData?.venueId || null} onVenueSelect={setVenueId} />
								</div>
							</div>
						</TableCell>
					</TableRow>

					<TableRow className="px-4">
						<TableCell colSpan={2} className="px-4 py-4 text-right">
							<Button type="submit" disabled={loading || !userRole}>
								{loading ? (initialData ? "Updating..." : "Adding...") : (initialData ? "Update User" : "Add User")}
							</Button>
						</TableCell>
					</TableRow>

				</TableBody>
			</Table>
		</form>
	);
}
