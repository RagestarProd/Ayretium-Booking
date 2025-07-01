'use client'

import { useEffect, useState } from 'react'

export default function VenueList() {
	const [venues, setVenues] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [page, setPage] = useState(1)

	// Incrementer for pagination
	const nextPage = () => setPage((prev) => prev + 1)
	const prevPage = () => setPage((prev) => Math.max(1, prev - 1))

	useEffect(() => {

		const fetchVenues = async () => {
			setLoading(true)
			setError(null)

			try {

				const ids = [2716, 737, 176]

				// Build URL with repeated id[] parameters
				const queryParams = ids.map(id => `q[id][]=${encodeURIComponent(id)}`).join('&')

				// Get all live venues
				const res = await fetch(`/api/venues?page=${page}&per_page=80&dbids=${JSON.stringify(ids)}`)
				if (!res.ok) throw new Error('Failed to fetch')
				const data = await res.json()
				setVenues(data.members)

			} catch (err) {
				setError(err.message || 'Error')
			} finally {
				setLoading(false)
			}
		}

		fetchVenues()
	}, [page])

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Live Venues (Page {page})</h1>

			{error && <p className="text-red-500 mb-4">Error: {error}</p>}

			{loading ? (
				<p className="mb-4">Loading...</p>
			) : venues.length === 0 ? (
				<p className="mb-4 text-gray-500">No venues found on this page.</p>
			) : (
				<ul className="space-y-2 mb-6">
					{venues.map((v) => (
						<li key={v.id} className="border p-4 rounded flex justify-between items-center">
							<div>
								<strong>{v.name}</strong>
								<br />
								<span>{v.id}</span>
								<br />
								{v.primary_address?.city || 'No city'}
							</div>
						</li>
					))}
				</ul>
			)
			}

			<div className="flex gap-4">
				<button
					onClick={prevPage}
					disabled={page === 1 || loading}
					className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
				>
					Previous
				</button>

				{venues.length > 0 && (
					<button
						onClick={nextPage}
						disabled={loading}
						className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
					>
						Next
					</button>
				)}

			</div>
		</div >
	)
}
