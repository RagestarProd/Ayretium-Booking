'use client'

import { useEffect, useState } from 'react'
import { IconEdit, IconBuildingCommunity, IconFilter } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from 'framer-motion'
import DeleteButton from '@/components/DeleteButton'

export default function RoomPage() {
	const [venueRooms, setVenueRooms] = useState([])
	const [venues, setVenues] = useState([])
	const [selectedVenueId, setSelectedVenueId] = useState('all')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [deletingRoomId, setDeletingRoomId] = useState(null)
	const router = useRouter()

	const fetchData = async () => {
		setLoading(true)
		setError(null)

		try {

			// Get all rooms and all venues (for filter)
			const [roomRes, venueRes] = await Promise.all([
				fetch(`/api/venues/rooms`),
				fetch(`/api/venues/db`),
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

	useEffect(() => {
		fetchData()
	}, [])

	// Filter rooms be selected venue
	const filteredRooms =
		selectedVenueId === 'all'
			? venueRooms
			: venueRooms.filter((r) => String(r.venue.id) === selectedVenueId)


	// Room delete animation config
	const rowVariants = {
		initial: {
			opacity: 1,
			scale: 1,
			backgroundColor: 'transparent',
			height: 'auto',
			paddingTop: '0.75rem',
			paddingBottom: '0.75rem',
			marginTop: 0,
			marginBottom: 0,
		},
		flashRed: {
			backgroundColor: '#f87171',
			transition: {
				backgroundColor: {
					duration: 0.25,
					yoyo: 1,
				},
			},
		},
		exit: {
			scale: 0.8,
			opacity: 0,
			height: 0,
			paddingTop: 0,
			paddingBottom: 0,
			marginTop: 0,
			marginBottom: 0,
			transition: { duration: 0.5 },
		},
	}

	// Room delete animation
	const handleDeleteAnimation = (id) => {
		setDeletingRoomId(id)
		setTimeout(() => {
			setVenueRooms((prev) => prev.filter((r) => r.id !== id))
			setDeletingRoomId(null)
		}, 750)
	}


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
						{error && (
							<tr>
								<td colSpan={3} className="p-4 text-center font-medium">
									Error: {error}
								</td>
							</tr>
						)}

						{loading && (
							<tr>
								<td colSpan={3} className="p-4 text-center font-medium">
									Loading...
								</td>
							</tr>
						)}

						{filteredRooms.length === 0 && !loading && (
							<tr>
								<td colSpan={3} className="p-4 text-center font-medium">
									No rooms found
								</td>
							</tr>
						)}

						<AnimatePresence initial={false}>
							{filteredRooms.map((room) => {
								const isDeleting = deletingRoomId === room.id
								return (
									<motion.tr
										key={room.id}
										initial="initial"
										animate={isDeleting ? 'flashRed' : 'initial'}
										exit="exit"
										variants={rowVariants}
										className="border-t hover:bg-border/20"
										transition={{
											backgroundColor: { duration: 0.25, yoyo: 1 },
											scale: { duration: 0.5, delay: isDeleting ? 0.25 : 0 },
											height: { duration: 0.5, delay: isDeleting ? 0.25 : 0 },
											paddingTop: { duration: 0.5, delay: isDeleting ? 0.25 : 0 },
											paddingBottom: { duration: 0.5, delay: isDeleting ? 0.25 : 0 },
											marginTop: { duration: 0.5, delay: isDeleting ? 0.25 : 0 },
											marginBottom: { duration: 0.5, delay: isDeleting ? 0.25 : 0 },
										}}
									>
										<td className="px-4 py-3 font-medium">{room.name}</td>
										<td className="px-4 py-3 text-muted-foreground">
											{room.venue?.name || 'Unknown Venue'}
										</td>
										<td className="px-4 py-3 text-right space-x-2">
											<Button
												size="icon"
												variant="ghost"
												onClick={() =>
													router.push(`/dashboard/venue/room/${room.id}/update`)
												}
												className="text-background hover:text-white"
											>
												<IconEdit className="w-4 h-4" />
											</Button>

											<DeleteButton
												delUrl={`/api/venues/rooms/${room.id}`}
												item={room}
												onDeleted={() => handleDeleteAnimation(room.id)}
											/>
										</td>
									</motion.tr>
								)
							})}
						</AnimatePresence>
					</tbody>
				</table>
			</div>
		</div>
	)
}
