'use client'

import { useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from "@/components/ui/label"

export default function VenueSelect({ onVenueSelect }) {
	const [venues, setVenues] = useState([])
	const [selectedIds, setSelectedIds] = useState([])
	const [loading, setLoading] = useState(true)

	// Get all venues from DB
	useEffect(() => {
		const fetchVenues = async () => {
			try {
				const res = await fetch('/api/venues')
				const data = await res.json()
				setVenues(data.data)
			} catch (err) {
				console.error('Error fetching venue groups:', err)
			} finally {
				setLoading(false)
			}
		}

		fetchVenues()
	}, [])

	// Build selected venue IDs array
	const toggleSelection = (id) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
		)
	}

	// Send selected venue IDs to parent
	useEffect(() => {
		if (onVenueSelect) {
			onVenueSelect(selectedIds)
		}
	}, [selectedIds, onVenueSelect])

	return (
		<div>
			<Label className="mb-2">
				{selectedIds.length === 0
					? 'Select Venues'
					: `Selected (${selectedIds.length})`}
			</Label>

			<div className="border rounded-md max-h-64 overflow-y-auto p-2">
				{loading ? (
					<div className="p-4 text-sm text-gray-500">Loading...</div>
				) : (
					venues.map((venue) => (
						<label
							key={venue.id}
							className="flex items-center gap-2 cursor-pointer py-1"
						>
							<Checkbox
								checked={selectedIds.includes(venue.id)}
								onCheckedChange={() => {
									toggleSelection(venue.id);
								}}
							/>
							<span className="text-sm">{venue.name}</span>
						</label>
					))
				)}
			</div>
		</div>
	)
}
