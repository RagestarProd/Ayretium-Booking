"use client";

import React, { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { formatDistanceToNow, format } from 'date-fns'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { IconEdit, IconTrash, IconBuildingCommunity } from '@tabler/icons-react'
import { useRouter } from "next/navigation";

import { motion, AnimatePresence } from 'framer-motion'
import DeleteButton from '@/components/DeleteButton'  // import the above component

export default function UsersPage() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [deletingUserId, setDeletingUserId] = useState(null)

	const router = useRouter();

	// Fetch users from API
	useEffect(() => {
		async function fetchUsers() {
			try {
				const res = await fetch("/api/users");
				if (!res.ok) throw new Error("Failed to fetch users");
				const data = await res.json();
				setUsers(data);
			} catch (err) {
				toast.error(err.message);
			} finally {
				setLoading(false);
			}
		}
		fetchUsers();
	}, []);

	// Handle edit click
	const handleEdit = (user) => {
		toast(`Edit user: ${user.id}`);
		// TODO: implement edit flow
	};

	// Handle delete click
	const handleDelete = async (user) => {
		if (!confirm(`Delete user ${user.id}? This cannot be undone.`)) return;

		try {
			const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Failed to delete user");
			toast.success("User deleted");
			setUsers((prev) => prev.filter((u) => u.id !== user.id));
		} catch (err) {
			toast.error(err.message);
		}
	};

	const rowVariants = {
		initial: { opacity: 1, scale: 1, height: 'auto', paddingTop: '0.75rem', paddingBottom: '0.75rem' },
		flashRed: {
			backgroundColor: '#f87171',
			transition: { backgroundColor: { duration: 0.25, yoyo: 1 } }
		},
		exit: {
			scale: 0.8,
			opacity: 0,
			height: 0,
			paddingTop: 0,
			paddingBottom: 0,
			transition: { duration: 0.5 }
		}
	}

	const handleDeleteAnimation = (id) => {
		setDeletingUserId(id)
		setTimeout(() => {
			setUsers((prev) => prev.filter((u) => u.id !== id))
			setDeletingUserId(null)
		}, 750)
	}

	if (loading) return <div className="p-4 text-center">Loading users...</div>;

	if (users.length === 0)
		return <div className="p-4 text-center">No users found</div>;

	return (
		<div className="p-4 max-w-full overflow-auto">
			<Table className="min-w-[700px]">
				<TableHeader>
					<TableRow>
						<TableHead>User</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Last Login</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					<AnimatePresence initial={false}>
						{users.map(user => {
							const isDeleting = deletingUserId === user.id
							return (
								<motion.tr
									key={user.id}
									initial="initial"
									animate={isDeleting ? 'flashRed' : 'initial'}
									exit="exit"
									variants={rowVariants}
									className="border-t border-b hover:bg-border/20"
									transition={{
										backgroundColor: { duration: 0.25, yoyo: 1 },
										scale: { duration: 0.5, delay: isDeleting ? 0.25 : 0 },
										height: { duration: 0.5, delay: isDeleting ? 0.25 : 0 },
										paddingTop: { duration: 0.5, delay: isDeleting ? 0.25 : 0 },
										paddingBottom: { duration: 0.5, delay: isDeleting ? 0.25 : 0 },
									}}
								>
									{/* Remove nested TableRow here */}
									<TableCell className="flex items-center gap-3">
										<Avatar>
											<AvatarImage src={`https://api.dicebear.com/9.x/bottts/svg?seed=${encodeURIComponent(user.id)}`} />
										</Avatar>
										<div>{user.name || "Unnamed User"}</div>
									</TableCell>

									<TableCell>{user.email || "-"}</TableCell>
									<TableCell className="capitalize">{user.role || "-"}</TableCell>

									<TableCell>
										{user.lastLogin ? (
											<Tooltip>
												<TooltipTrigger asChild>
													<span className="cursor-help underline decoration-dotted">
														{formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true })}
													</span>
												</TooltipTrigger>
												<TooltipContent side="top">
													{format(new Date(user.lastLogin), 'PPP p')}
												</TooltipContent>
											</Tooltip>
										) : (
											"-"
										)}
									</TableCell>

									<TableCell className="px-4 py-3 space-x-2 text-right">
										<Button
											size="icon"
											variant="ghost"
											onClick={() => router.push(`/dashboard/users/${user.id}/update`)}
											className="text-background hover:text-white"
										>
											<IconEdit className="w-4 h-4" />
										</Button>
										<DeleteButton
											delUrl={`/api/users/${user.id}`}
											item={user}
											onDeleted={() => handleDeleteAnimation(user.id)}
										/>
									</TableCell>
								</motion.tr>
							)
						})}
					</AnimatePresence>
				</TableBody>
			</Table>
		</div>
	);
}
