'use client'

import { useEffect, useState } from 'react'

export default function VenueListWithPagination() {
	const [venues, setVenues] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const [actionLoading, setActionLoading] = useState({})
	const [actionError, setActionError] = useState({})
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)

	useEffect(() => {
		const fetchVenues = async () => {
			setLoading(true)
			setError(null)

			try {

				// Get venues from RMS
				const res = await fetch(`/api/venues/import?page=${page}&per_page=100`)
				const result = await res.json()
				if (!res.ok) throw new Error(result.message || 'Failed to fetch')

				setVenues(result.data)
				setTotalPages(result.meta.totalPages)
			} catch (err) {
				setError(err.message || 'Error')
			} finally {
				setLoading(false)
			}
		}

		fetchVenues()
	}, [page])

	const handleNext = () => {
		if (page < totalPages) setPage((p) => p + 1)
	}

	const handlePrev = () => {
		if (page > 1) setPage((p) => p - 1)
	}

	// Clicked button to toggle venue visibility
	const updateVenueField = async (id, { visibilityStatus, name }) => {
		setActionLoading((prev) => ({ ...prev, [id]: true }));
		setActionError((prev) => ({ ...prev, [id]: null }));

		try {
			const res = await fetch(`/api/venues/${id}/update`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ visibilityStatus, name }),  // <-- send name here
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || 'Action failed');
			}

			setVenues((prevVenues) =>
				prevVenues.map((v) =>
					v.id === id ? { ...v, visible: visibilityStatus } : v
				)
			);
		} catch (err) {
			setActionError((prev) => ({ ...prev, [id]: err.message || 'Error' }));
		} finally {
			setActionLoading((prev) => ({ ...prev, [id]: false }));
		}
	};



	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Current RMS Venues</h1>

			{error && <p className="text-red-500 mb-4">Error: {error}</p>}

			{loading ? (
				<p className="mb-4">Loading...</p>
			) : (
				<div>
					<ul className="mb-6 flex flex-wrap">
						{venues.map((v) => (
							<li key={v.id} className="border p-4 m-3 rounded flex justify-between items-center w-md">
								<div>
									<strong>{v.name}</strong>
									<br />
									{v.primary_address?.city || 'No city'}
									{actionError[v.id] && (
										<p className="text-red-500 text-sm mt-1">{actionError[v.id]}</p>
									)}
								</div>
								{!v.visible ? (
									<button
										disabled={actionLoading[v.id]}
										onClick={() => updateVenueField(v.id, { visibilityStatus: 1, name: v.name })}
										className="ml-4 bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
									>
										{actionLoading[v.id] ? 'Processing...' : 'Show In App'}
									</button>
								) : (
									<button
										disabled={actionLoading[v.id]}
										onClick={() => updateVenueField(v.id, { visibilityStatus: 0, name: v.name })}
										className="ml-4 bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
									>
										{actionLoading[v.id] ? 'Processing...' : 'Hide In App'}
									</button>
								)}
							</li>
						))}

					</ul>

					<div className="flex justify-between">
						<button
							onClick={handlePrev}
							disabled={page <= 1}
							className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
						>
							Previous
						</button>

						<span className="text-sm text-gray-600">
							Page {page} of {totalPages}
						</span>

						<button
							onClick={handleNext}
							disabled={page >= totalPages}
							className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
						>
							Next
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
