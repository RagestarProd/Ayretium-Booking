'use client'

import VenueRoomForm from "@/components/VenueRoomForm"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

export default function NewVenueRoomPage() {
	return (
		<div className="p-6 max-w-xl">
			<Card className="shadow-xs border rounded-lg p-0">
				<CardHeader>
					<CardTitle className="text-2xl mt-4">Create New Room</CardTitle>
					<CardDescription>
						Fill in the details to add a new room to a venue.
					</CardDescription>
				</CardHeader>
				<CardContent className="p-0">
					<VenueRoomForm />
				</CardContent>
			</Card>
		</div>
	)
}
