'use client'

import { useEffect, useState } from 'react'

export default function VenueListWithPagination() {
	const [venues, setVenues] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)

	useEffect(() => {
		const fetchVenues = async () => {
			setLoading(true)
			setError(null)

			try {
				const res = await fetch(`/api/venues?page=${page}&per_page=50`)
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

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Venues</h1>

			{error && <p className="text-red-500 mb-4">Error: {error}</p>}

			{loading ? (
				<p className="mb-4">Loading...</p>
			) : (
				<div>
					<ul className="space-y-2 mb-6">
						{venues.map((v) => (
							<li key={v.id}>
								<div className="border p-4 rounded mb-4">
									<h2 className="text-lg font-semibold mb-2">{v.name || '--DELETED VENUE--'}</h2>

									<p><strong>ID:</strong> {v.id}</p>
									<p><strong>Current ID:</strong> {v.current_id}</p>
									<p><strong>Visible:</strong> {v.visible}</p>
									<p><strong>Created At:</strong> {new Date(v.createdAt).toLocaleString()}</p>
									<p><strong>Updated At:</strong> {new Date(v.updatedAt).toLocaleString()}</p>
									<p><strong>Venue Group ID:</strong> {v.venueGroupId ?? 'None'}</p>

									<div className="mt-4">
										<h3 className="font-semibold">Primary Address</h3>
										{v.primary_address ? (
											<div className="text-sm mt-1 space-y-1">
												<p><strong>Name:</strong> {v.primary_address.name}</p>
												<p><strong>Street:</strong> {v.primary_address.street}</p>
												<p><strong>City:</strong> {v.primary_address.city}</p>
												<p><strong>County:</strong> {v.primary_address.county}</p>
												<p><strong>Postcode:</strong> {v.primary_address.postcode}</p>
												<p><strong>Country:</strong> {v.primary_address.country_name}</p>
												<p><strong>Type:</strong> {v.primary_address.address_type_name}</p>
												<p><strong>Created At:</strong> {new Date(v.primary_address.created_at).toLocaleString()}</p>
												<p><strong>Updated At:</strong> {new Date(v.primary_address.updated_at).toLocaleString()}</p>
											</div>
										) : (
											<p className="text-sm text-gray-500">No address data available</p>
										)}
									</div>
								</div>

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
