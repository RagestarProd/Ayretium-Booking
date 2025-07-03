'use client'

import { useEffect, useState } from 'react'
import { IconEdit, IconTrash, IconBuildingCommunity, IconFilter } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useRouter } from "next/navigation";

export default function RoomPage() {
	const [venueRooms, setVenueRooms] = useState([])
	const [venues, setVenues] = useState([])
	const [selectedVenueId, setSelectedVenueId] = useState('all')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const router = useRouter();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			setError(null)

			try {
				const [roomRes, venueRes] = await Promise.all([
					fetch(`/api/venues/rooms`),
					fetch(`/api/venues`),
				])

				if (!roomRes.ok || !venueRes.ok) throw new Error('Failed to fetch')

				const roomData = await roomRes.json()
				const venueData = await venueRes.json()

				setVenueRooms(roomData)
				setVenues(venueData.data)
			} catch (err) {
				setError(err.message || 'Error')
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	const filteredRooms =
		selectedVenueId === 'all'
			? venueRooms
			: venueRooms.filter((r) => String(r.venue.id) === selectedVenueId);
			
		console.log(filteredRooms);

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Venue Rooms</h1>

			<div className="rounded-md border overflow-hidden">
				<table className="w-full text-sm">
					<thead className="bg-border">
						<tr className="text-left">
							<th className="px-4 py-2">Room Name</th>
							<th className="px-4 py-2">
								<div className="flex items-center gap-2">
									<IconBuildingCommunity className="w-4 h-4" />
									Venue
								</div>
							</th>
							<th className="px-4 py-2 text-right">
								<div className="flex items-center justify-end gap-2">
									<IconFilter className="w-4 h-4" />
									<select
										value={selectedVenueId}
										onChange={(e) => setSelectedVenueId(e.target.value)}
										className="text-sm border rounded px-2 py-1 bg-white"
									>
										<option value="all">All Venues</option>
										{venues.map((v) => (
											<option key={v.id} value={v.id}>
												{v.name || `Venue #${v.id}`}
											</option>
										))}
									</select>
								</div>
							</th>
						</tr>
					</thead>
					<tbody>
						{error && <tr><td colSpan={3} className="p-4 text-center font-medium"><p className="text-center">Error: {error}</p></td></tr>}

						{loading ? (
							<tr><td colSpan={3} className="p-4 text-center font-medium"><p className="text-center">Loading...</p></td></tr>
						) : null}

						{filteredRooms.length === 0 && !loading ? (
							<tr><td colSpan={3} className="p-4 text-center font-medium"><p className="text-center">No rooms found</p></td></tr>
						) : null}

						{filteredRooms.map((room) => (
							<tr key={room.id} className="border-t hover:bg-border/20">
								<td className="px-4 py-3 font-medium">{room.name}</td>
								<td className="px-4 py-3 text-muted-foreground">
									{room.venue?.name || 'Unknown Venue'}
								</td>
								<td className="px-4 py-3 text-right space-x-2">
									<Button
										size="icon"
										variant="ghost"
										onClick={() => router.push(`/dashboard/venue/room/${room.id}/update`)}
										className="text-background hover:text-white"
									>
										<IconEdit className="w-4 h-4" />
									</Button>
									<Button
										size="icon"
										variant="ghost"
										onClick={() => router.push(`/rooms/edit/${room.id}`)}
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
		</div>
	)
}
