'use client'

import { useEffect, useState } from 'react'

export default function VenueList() {
	const [venueGroups, setVenueGroups] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {

		const fetchVenueGroups = async () => {
			setLoading(true)
			setError(null)

			try {
				// Get all venues
				const res = await fetch(`/api/venues/groups`)
				if (!res.ok) throw new Error('Failed to fetch')
				const data = await res.json()

				setVenueGroups(data)

			} catch (err) {
				setError(err.message || 'Error')
			} finally {
				setLoading(false)
			}
		}

		fetchVenueGroups()
	}, [])

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Venue Groups</h1>

			{error && <p className="text-red-500 mb-4">Error: {error}</p>}

			{loading ? (
				<p className="mb-4">Loading...</p>
			) : (
				<ul className="space-y-2 mb-6">
					{venueGroups.map((v) => (
						<li key={v.id} className="border p-4 rounded flex justify-between items-center">
							<div>
								<strong>{v.name}</strong>
								<br />
								<span>{v.venues?.length || 0} venues</span>
							</div>
						</li>
					))}
				</ul>
			)
			}
		</div >
	)
}
