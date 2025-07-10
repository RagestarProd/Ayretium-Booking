'use client';

import { useState, useEffect } from 'react';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export default function VenueGroupSelect({ value, onChange }) {
	const [venueGroups, setVenueGroups] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchVenueGroups = async () => {
			try {
				const res = await fetch('/api/venues/groups');
				const data = await res.json();
				setVenueGroups(data || []);
			} catch (error) {
				console.error('Failed to load venue groups:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchVenueGroups();
	}, []);

	return (
		<div className="space-y-2">
			{loading ? (
				<Skeleton className="h-10 w-full rounded-md" />
			) : (
				<Select
					value={value ? value.toString() : undefined}
					onValueChange={onChange}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select a venue group" />
					</SelectTrigger>
					<SelectContent>
						{venueGroups.map(group => (
							<SelectItem key={group.id} value={group.id.toString()}>
								{group.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
		</div>
	);
}
