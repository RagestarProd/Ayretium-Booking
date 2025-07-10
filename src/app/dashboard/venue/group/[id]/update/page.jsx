'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import VenueGroupForm from '@/components/VenueGroupForm'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

export default function EditVenueGroupPage() {
	const { id } = useParams()

	const [groupData, setGroupData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			setError(null)

			try {
				const res = await fetch(`/api/venues/groups/${id}`, {
					method: 'GET'
				}); if (!res.ok) throw new Error('Failed to fetch')

				const data = await res.json()
				setGroupData(data)
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
	if (!groupData) return <p>No data found.</p>

	return (

		<div className="p-6 max-w-xl">
			<Card className="shadow-xs border rounded-lg p-0">
				<CardHeader>
					<CardTitle className="text-2xl mt-4">Update Organisation</CardTitle>
					<CardDescription>
						Fill in the details to update the organisation.
					</CardDescription>
				</CardHeader>
				<CardContent className="p-0"><VenueGroupForm initialData={groupData} /></CardContent>
			</Card>
		</div >
	)
}
