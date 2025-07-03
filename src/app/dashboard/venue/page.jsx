'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { IconEdit, IconTrash, IconBuildingCommunity } from '@tabler/icons-react'
import { useRouter } from "next/navigation";

export default function VenueListWithPagination() {
	const [venues, setVenues] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const router = useRouter();

	useEffect(() => {
		const fetchVenues = async () => {
			setLoading(true)
			setError(null)

			try {
				const res = await fetch(`/api/venues?page=${page}&per_page=10`)
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
				<p>Loading venues...</p>
			) : venues.length === 0 ? (
				<p>No venues found.</p>
			) : (

				<div className="rounded-md border overflow-hidden">
					<table className="w-full text-sm">
						<thead className="bg-border">
							<tr className="text-left">
								<th className="px-4 py-2">Venue Name</th>
								<th className="px-4 py-2"><div className="flex items-center gap-2">
									<IconBuildingCommunity className="w-4 h-4" />
									Primary Address
								</div></th>
								<th className="px-4 py-2 text-right">
									<div className="items-center gap-2">
										Actions
									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							{venues.map((v) => (
								<tr key={v.id} className="border-t hover:bg-border/20">
									<td className="px-4 py-3 font-medium">{v.name || '--DELETED VENUE--'}</td>
									<td className="px-4 py-3 text-sm">
										{v.primary_address ? (
											<>
												<p>{v.primary_address.name}</p>
												<p>{v.primary_address.street}</p>
												<p>{v.primary_address.city}</p>
												<p>{v.primary_address.county}</p>
												<p>{v.primary_address.postcode}</p>
												<p>{v.primary_address.country_name}</p>
												<p>{v.primary_address.address_type_name}</p>
											</>
										) : (
											<span className="text-gray-500">No address data</span>
										)}
									</td>
									<td className="px-4 py-3 space-x-2">
										<Button
											size="icon"
											variant="ghost"
											onClick={() => router.push(`/dashboard/venue/${v.id}/update`)}
											className="text-background hover:text-white"
										>
											<IconEdit className="w-4 h-4" />
										</Button>
										<Button
											size="icon"
											variant="ghost"
											onClick={() => router.push(`/venue/edit/${v.id}`)}
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
			)}

			<div className="flex justify-between mt-6">
				<Button
					onClick={handlePrev}
					disabled={page <= 1}
					className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
				>
					Previous
				</Button>

				<span className="text-sm text-gray-600">
					Page {page} of {totalPages}
				</span>

				<Button
					onClick={handleNext}
					disabled={page >= totalPages}
					className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
				>
					Next
				</Button>
			</div>
		</div>
	)
}
