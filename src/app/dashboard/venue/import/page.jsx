'use client'

import { useEffect, useState } from 'react'
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

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
				const res = await fetch(`/api/venues/import?page=${page}&per_page=100`)
				const result = await res.json()
				if (!res.ok) throw new Error(result.message || 'Failed to fetch')

				setVenues(
					result.data.map(v => ({
						...v,
						visible: v.visible === true || v.visible === 1 ? true : false,  // Force boolean
					}))
				)
				setTotalPages(result.meta.totalPages)
			} catch (err) {
				setError(err.message || 'Error')
			} finally {
				setLoading(false)
			}
		}
		fetchVenues()
	}, [page])

	const handleNext = () => page < totalPages && setPage(p => p + 1)
	const handlePrev = () => page > 1 && setPage(p => p - 1)

	const updateVenueField = async (id, { visibilityStatus, name }) => {
		setActionLoading(prev => ({ ...prev, [id]: true }))
		setActionError(prev => ({ ...prev, [id]: null }))

		try {
			const res = await fetch(`/api/venues/${id}/update`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ visibilityStatus, name }),
			})

			if (!res.ok) {
				const errorData = await res.json()
				throw new Error(errorData.error || 'Action failed')
			}

			setVenues(
				result.data.map(v => ({
					...v,
					visible: v.visible === true || v.visible === 1 ? true : false,  // Force boolean
				}))
			)

		} catch (err) {
			setActionError(prev => ({ ...prev, [id]: err.message || 'Error' }))
		} finally {
			setActionLoading(prev => ({ ...prev, [id]: false }))
		}
	}


	return (
		<div className="p-6">
			<h1 className="text-lg font-medium mb-4">Current RMS Venues</h1>
			{error && <p className="text-red-500 mb-2">Error: {error}</p>}
			{loading ? (
				<p>Loading...</p>
			) : (
				<>
					<Table className="text-sm">
						<TableHeader>
							<TableRow>
								<TableHead className="px-2 py-1">Name</TableHead>
								<TableHead className="px-2 py-1">City</TableHead>
								<TableHead className="px-2 py-1">Visibility</TableHead>
								<TableHead className="px-2 py-1"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{venues.map(v => (
								<TableRow key={v.id}>
									<TableCell className="px-2 py-1">{v.name}</TableCell>
									<TableCell className="px-2 py-1">
										{v.primary_address?.city ?? '-'}
									</TableCell>
									<TableCell className="px-2 py-1">
										{v.visible ? 'Visible' : 'Hidden'}
									</TableCell>
									<TableCell className="px-2 py-1 text-right">
										<Button
											size="sm"
											variant={v.visible ? 'destructive' : 'default'}
											disabled={actionLoading[v.id]}
											onClick={() =>
												updateVenueField(v.id, {
													visibilityStatus: v.visible ? 0 : 1,
													name: v.name,
												})
											}
										>
											{actionLoading[v.id]
												? '...'
												: v.visible
													? 'Hide'
													: 'Show'}
										</Button>
										{actionError[v.id] && (
											<p className="text-xs text-red-500 mt-1">
												{actionError[v.id]}
											</p>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					<div className="flex justify-between items-center mt-4">
						<Button
							size="sm"
							variant="outline"
							onClick={handlePrev}
							disabled={page <= 1}
						>
							Previous
						</Button>
						<span className="text-sm text-gray-600">
							Page {page} of {totalPages}
						</span>
						<Button
							size="sm"
							variant="outline"
							onClick={handleNext}
							disabled={page >= totalPages}
						>
							Next
						</Button>
					</div>
				</>
			)}
		</div>
	)
}
