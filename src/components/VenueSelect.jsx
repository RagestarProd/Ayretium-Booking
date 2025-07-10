'use client'

import { useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem
} from '@/components/ui/select'
import { useParams } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

export default function VenueSelect({
	onVenueSelect,
	mode = 'multiselect',
	initialVenueId = null,
	selectedIdss = [],
}) {
	const [venues, setVenues] = useState([])
	const [selectedIds, setSelectedIds] = useState([])
	const [selectedId, setSelectedId] = useState(null)
	const [loading, setLoading] = useState(true)

	const params = useParams()
	const currentVenueGroupID = params?.id ? Number(params.id) : null

	const isEditMode = selectedIdss.length > 0
	const initialIds = selectedIdss.map((v) => (typeof v === 'object' ? v.id : v))

	useEffect(() => {
		const fetchVenues = async () => {
			try {
				const res = await fetch('/api/venues/db')
				const data = await res.json()
				setVenues(data.data)
			} catch (err) {
				console.error('Error fetching venues:', err)
			} finally {
				setLoading(false)
			}
		}

		fetchVenues()

		if (mode === 'singleselect' && initialVenueId) {
			setSelectedId(initialVenueId)
		}
		if (mode === 'multiselect' && Array.isArray(selectedIdss)) {
			setSelectedIds(initialIds)
		}
	}, [])

	const toggleSelection = (id) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
		)
	}

	const handleSingleSelect = (value) => {
		const selected = value === '' ? null : Number(value)
		setSelectedId(selected)
	}

	useEffect(() => {
		if (!onVenueSelect) return
		if (mode === 'singleselect') {
			onVenueSelect(selectedId)
		} else {
			onVenueSelect(selectedIds)
		}
	}, [selectedId, selectedIds, onVenueSelect, mode])

	return (
		<div className="space-y-2">
			{loading ? (
				<Skeleton className="h-10 w-full rounded-md" />
			) : mode === 'singleselect' ? (
				<Select
					value={selectedId ? selectedId.toString() : undefined}
					onValueChange={handleSingleSelect}
				>
					<SelectTrigger>
						<SelectValue placeholder="Choose a venue" />
					</SelectTrigger>
					<SelectContent>
						{venues.map((venue) => (
							<SelectItem key={venue.id} value={venue.id.toString()}>
								{venue.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			) : (
				<div className="border rounded-lg max-h-64 overflow-y-auto p-2 space-y-1">
					{venues.map((venue) => {
						const isInThisGroup = selectedIds.includes(venue.id)
						const isDisabled = venue.venueGroupId !== null && currentVenueGroupID !== venue.venueGroupId

						return (
							<label
								key={venue.id}
								className={`flex items-center gap-2 py-1 px-2 rounded-md ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'}`}
							>
								<Checkbox
									checked={isInThisGroup}
									onCheckedChange={() => toggleSelection(venue.id)}
									disabled={isDisabled}
								/>
								<span className="text-sm text-foreground whitespace-break-spaces">{venue.name}</span>
							</label>
						)
					})}
				</div>
			)}
		</div>
	)
}
