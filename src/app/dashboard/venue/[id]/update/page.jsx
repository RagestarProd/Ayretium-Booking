'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import VenueForm from "@/components/VenueForm"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

export default function EditVenuePage() {
	const { id } = useParams()

	const [venueData, setVenueData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			setError(null)

			try {
				const res = await fetch(`/api/venues/${id}`)
				if (!res.ok) throw new Error('Failed to fetch')
				const data = await res.json()
				setVenueData(data)
			} catch (err) {
				setError(err.message || 'Error')
			} finally {
				setLoading(false)
			}
		}

		if (id) fetchData()
	}, [id])

	if (loading) return <p>Loading...</p>
	if (error) return <p className="text-red-500">Error: {error}</p>
	if (!venueData) return <p>No data found.</p>

	return (
		<div className="p-6 max-w-xl">
			<Card className="shadow-xs border rounded-lg">
				<CardHeader>
					<CardTitle className="text-2xl">Update Venue</CardTitle>
					<CardDescription>
						Fill in the details to update the venue.
						<br />
						<strong>This venue will updated in Current RMS</strong>
					</CardDescription>
				</CardHeader>
				<CardContent className="p-0">
					<VenueForm initialData={venueData} />
				</CardContent>
			</Card>
		</div>
	)
}
