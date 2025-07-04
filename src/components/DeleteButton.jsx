'use client'

import { Button } from '@/components/ui/button'
import { IconTrash } from '@tabler/icons-react'
import { toast } from 'sonner'
import React, { useState } from 'react'
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogCancel,
	AlertDialogAction,
} from '@/components/ui/alert-dialog'

export default function DeleteButton({ delUrl, item, onDeleted }) {
	const [loading, setLoading] = useState(false)

	const handleDelete = async () => {
		setLoading(true)
		try {
			const res = await fetch(delUrl, {
				method: 'DELETE',
			})
			if (!res.ok) throw new Error('Failed to delete')
			toast.success(`Deleted "${item.name}"`)
			onDeleted()
		} catch (err) {
			toast.error(err.message || 'Error deleting')
		} finally {
			setLoading(false)
		}
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					size="icon"
					variant="ghost"
					className="text-primary hover:text-white"
					disabled={loading}
					aria-label={`Delete ${item.name}`}
				>
					<IconTrash />
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This will permanently delete <strong>{item.name}</strong>. This
						action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete} disabled={loading}>
						{loading ? 'Deleting...' : 'Delete'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
