'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import VenueCard from '@/components/VenueCard'

export default function VenuesPage() {
	const [venues, setVenues] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		async function fetchVenues() {
			setLoading(true)
			setError(null)
			try {
				const res = await fetch('/api/current/venues')
				if (!res.ok) throw new Error(`Error: ${res.status}`)
				const data = await res.json()
				setVenues(data.members || [])
			} catch (err) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}
		fetchVenues()
	}, [])

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-3xl font-bold">Venues</h1>
			<Separator />

			{loading && <p>Loading venues…</p>}
			{error && <p className="text-red-600">Error: {error}</p>}

			{!loading && !error && venues.length === 0 && <p>No venues found.</p>}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{venues.map((venue) => (
					  <VenueCard member={venue} />
				))}
			</div>
		</div>
	)
}
