"use client"

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import UserForm from '@/components/UserForm';

export default function EditUserPage() {
	const { id } = useParams();
	const router = useRouter();
	const [initialData, setInitialData] = useState(null);

	useEffect(() => {
		async function fetchUser() {
			try {
				const res = await fetch(`/api/users/${id}`);
				if (!res.ok) throw new Error('Failed to load user');
				const user = await res.json();
				setInitialData(user.data);
			} catch (err) {
				toast.error(err.message || 'Could not load user');
				router.push('/dashboard/users');
			}
		}
		if (id) fetchUser();
	}, [id, router]);

	return (
		<div className="p-6 max-w-xl">
			<Card className="shadow-xs border rounded-lg p-0">
				<CardHeader>
					<CardTitle className="text-2xl mt-4">Edit User</CardTitle>
					<CardDescription>Update the user's details and permissions.</CardDescription>
				</CardHeader>
				<CardContent className="p-0">
					<UserForm initialData={initialData} isLoading={!initialData} />
				</CardContent>
			</Card>
		</div>
	);
}
