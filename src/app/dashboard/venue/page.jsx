'use client'

import { useEffect, useState } from 'react'

export default function VenueList() {
	const [venues, setVenues] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [page, setPage] = useState(1)
	const [actionLoading, setActionLoading] = useState({})
	const [actionError, setActionError] = useState({})

	// Incrementer for pagination
	const nextPage = () => setPage((prev) => prev + 1)
	const prevPage = () => setPage((prev) => Math.max(1, prev - 1))

	useEffect(() => {

		const fetchVenues = async () => {
			setLoading(true)
			setError(null)

			try {

				// Get all venues
				const res = await fetch(`/api/venues?page=${page}&per_page=80`)
				if (!res.ok) throw new Error('Failed to fetch')
				const data = await res.json()

				// Get array of all loaded venue IDs
				const currentIDs = data.members.map(v => v.id)

				// Pass to check if these IDs are in DB
				const res2 = await fetch('/api/venues/import-check', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ currentIDs }),
				})

				if (!res2.ok) throw new Error('Failed to check existence')

				// Get array of venues that existt in DB
				const { existingIds } = await res2.json()

				// Create array of existing venues keyed by Current ID with visibility included
				const existingIdsMap = existingIds.reduce((acc, v) => {
					acc[v.id] = v
					return acc
				}, {})

				// Build array of combined Current venues with DB venues
				const venuesWithExistence = data.members.map(v => ({
					...v,
					existsInDb: existingIdsMap[v.id] !== undefined,
					visible: existingIdsMap[v.id]?.visible || 0,
				}))

				setVenues(venuesWithExistence)

			} catch (err) {
				setError(err.message || 'Error')
			} finally {
				setLoading(false)
			}
		}

		fetchVenues()
	}, [page])

	// Clicked button to toggle venue visibility
	const updateVenueField = async (id, { visibilityStatus }) => {
		setActionLoading((prev) => ({ ...prev, [id]: true }))
		setActionError((prev) => ({ ...prev, [id]: null }))

		try {

			// Send update to DB
			const res = await fetch(`/api/venues/${id}/update`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ visibilityStatus }),
			})

			if (!res.ok) {
				const errorData = await res.json()
				throw new Error(errorData.error || 'Action failed')
			}

			// Update venues var. Find the ID we just updated and set visibility
			setVenues((prevVenues) =>
				prevVenues.map((v) =>
					v.id === id ? { ...v, visible: visibilityStatus } : v
				)
			)
		} catch (err) {
			setActionError((prev) => ({ ...prev, [id]: err.message || 'Error' }))
		} finally {
			setActionLoading((prev) => ({ ...prev, [id]: false }))
		}
	}

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Venues (Page {page})</h1>

			{error && <p className="text-red-500 mb-4">Error: {error}</p>}

			{loading ? (
				<p className="mb-4">Loading...</p>
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
								{actionError[v.id] && (
									<p className="text-red-500 text-sm mt-1">{actionError[v.id]}</p>
								)}
							</div>
							{!v.visible ? (
								<button
									disabled={actionLoading[v.id]}
									onClick={() => updateVenueField(v.id, { visibilityStatus: 1 })}
									className="ml-4 bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
								>
									{actionLoading[v.id] ? 'Processing...' : 'Show In App'}
								</button>

							) : (
								<button
									disabled={actionLoading[v.id]}
									onClick={() => updateVenueField(v.id, { visibilityStatus: 0 })}
									className="ml-4 bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
								>
									{actionLoading[v.id] ? 'Processing...' : 'Hide In App'}
								</button>
							)}
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
				<button
					onClick={nextPage}
					disabled={loading}
					className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
				>
					Next
				</button>
			</div>
		</div >
	)
}
