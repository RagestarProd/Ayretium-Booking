'use client'

import { useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

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

	// Determine if we're in edit mode
	const isEditMode = selectedIdss.length > 0
	const initialIds = selectedIdss.map((v) => (typeof v === 'object' ? v.id : v))

	// Load venues and initial values
	useEffect(() => {
		const fetchVenues = async () => {
			try {
				const res = await fetch('/api/venues')
				const data = await res.json()
				console.log(data);
				setVenues(data.data)
			} catch (err) {
				console.error('Error fetching venues:', err)
			} finally {
				setLoading(false)
			}
		}

		fetchVenues()

		// Set initial selection
		if (mode === 'singleselect' && initialVenueId) {
			setSelectedId(initialVenueId)
		}
		if (mode === 'multiselect' && Array.isArray(selectedIdss)) {
			setSelectedIds(initialIds)
		}
	}, [])

	// Toggle selection
	const toggleSelection = (id) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
		)
	}

	// Handle single-select dropdown change
	const handleSingleSelect = (e) => {
		const value = e.target.value === '' ? null : Number(e.target.value)
		setSelectedId(value)
	}

	// Notify parent of selection
	useEffect(() => {
		if (!onVenueSelect) return
		if (mode === 'singleselect') {
			onVenueSelect(selectedId)
		} else {
			onVenueSelect(selectedIds)
		}
	}, [selectedId, selectedIds, onVenueSelect, mode])

	return (
		<div>
			<Label className="mb-2">
				{mode === 'singleselect'
					? 'Belongs to'
					: selectedIds.length === 0
						? 'Select Venues'
						: `Selected (${selectedIds.length})`}
			</Label>

			{loading ? (
				<div className="p-4 text-sm text-gray-500">Loading...</div>
			) : mode === 'singleselect' ? (
				<select
					value={selectedId || ''}
					onChange={handleSingleSelect}
					className="w-full p-2 border rounded rounded-[4.4px] border-input shadow-xs"
				>
					<option value="">Choose a venue</option>
					{venues.map((venue) => (
						<option key={venue.id} value={venue.id}>
							{venue.name}
						</option>
					))}
				</select>
			) : (
				<div className="border rounded-md max-h-64 overflow-y-auto p-2">
					{venues.map((venue) => {
						const isAssignedToGroup = venue.venueGroupId !== null
						const isInThisGroup = selectedIds.includes(venue.id)
						const isDisabled = !isEditMode && isAssignedToGroup

						return (
							<label
								key={venue.id}
								className={`flex items-center gap-2 cursor-pointer py-1 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''
									}`}
							>
								<Checkbox
									checked={isInThisGroup}
									onCheckedChange={() => toggleSelection(venue.id)}
									disabled={isDisabled}
								/>
								<span className="text-sm">{venue.name}</span>
							</label>
						)
					})}
				</div>
			)}
		</div>
	)
}
