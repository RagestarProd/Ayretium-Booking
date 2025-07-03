'use client'
import React from 'react'

import { useEffect, useState } from 'react'
import { IconEdit, IconTrash, IconBuildingStore, IconSearch } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useRouter } from "next/navigation";

export default function VenueGroupPage() {
	const [venueOrganisations, setVenueOrganisations] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [selectedVenueId, setSelectedVenueId] = useState('all')
	const router = useRouter()

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			setError(null)

			try {
				const [venueGroupRes] = await Promise.all([
					fetch(`/api/venues/groups`),
					// Remove separate venues fetch unless needed separately
					// fetch(`/api/venues`),
				])

				if (!venueGroupRes.ok) throw new Error('Failed to fetch venue groups')

				const venueGroupData = await venueGroupRes.json()
				setVenueOrganisations(venueGroupData)
			} catch (err) {
				setError(err.message || 'Error')
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	// For filter dropdown, extract all unique venues from all organisations
	const allVenues = React.useMemo(() => {
		// Flatten venues from all organisations (assuming each organisation has `venues` array)
		const venues = venueOrganisations.flatMap(org => org.venues || [])
		// Remove duplicates by venue id
		const uniqueVenues = Array.from(new Map(venues.map(v => [v.id, v])).values())
		return uniqueVenues
	}, [venueOrganisations])

	// Filter organisations by selected venue (if not 'all')
	const filteredOrganisations = selectedVenueId === 'all'
		? venueOrganisations
		: venueOrganisations.filter(org =>
			org.venues?.some(venue => String(venue.id) === selectedVenueId)
		)

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Organisations</h1>

			<div className="rounded-md border overflow-hidden">
				<table className="w-full text-sm">
					<thead className="bg-border">
						<tr className="text-left">
							<th className="px-4 py-2">Organisation Name</th>
							<th className="px-4 py-2">
								<div className="flex items-center gap-2">
									<IconBuildingStore className="w-4 h-4" />
									Venues
								</div>
							</th>
							<th className="px-4 py-2 text-right">
								<div className="flex items-center justify-end gap-2">
									<IconSearch className="w-4 h-4" />
									<select
										value={selectedVenueId}
										onChange={e => setSelectedVenueId(e.target.value)}
										className="text-sm border rounded px-2 py-1 bg-white"
									>
										<option value="all">All Venues</option>
										{allVenues.map((v) => (
											<option key={v.id} value={v.id}>
												{v.name || `Venue #${v.id}`}
											</option>
										))}
									</select>
								</div>
							</th>
						</tr>
					</thead>
					<tbody>
						{error && (
							<tr>
								<td colSpan={3} className="p-4 text-center font-medium">
									<p>Error: {error}</p>
								</td>
							</tr>
						)}

						{loading && (
							<tr>
								<td colSpan={3} className="p-4 text-center font-medium">
									<p>Loading...</p>
								</td>
							</tr>
						)}

						{!loading && filteredOrganisations.length === 0 && (
							<tr>
								<td colSpan={3} className="p-4 text-center font-medium">
									<p>No organisations found</p>
								</td>
							</tr>
						)}

						{filteredOrganisations.map(org => (
							<tr key={org.id} className="border-t hover:bg-border/20">
								<td className="px-4 py-3 font-medium">{org.name}</td>

								<td className="px-4 py-3 text-muted-foreground">
									{org.venues && org.venues.length > 0 ? (
										<ul className="list-disc list-inside space-y-1">
											{org.venues.map(venue => (
												<li key={venue.id}>{venue.name || `Venue #${venue.id}`}</li>
											))}
										</ul>
									) : (
										<em>No venues assigned</em>
									)}
								</td>

								<td className="px-4 py-3 text-right space-x-2">
									<Button
										size="icon"
										variant="ghost"
										onClick={() => router.push(`/dashboard/venue/group/${org.id}/update`)}
										className="text-background hover:text-white"
									>
										<IconEdit className="w-4 h-4" />
									</Button>
									<Button
										size="icon"
										variant="ghost"
										onClick={() => router.push(`/rooms/edit/${org.id}`)}
										className="text-primary hover:text-white"
									>
										<IconTrash />
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
