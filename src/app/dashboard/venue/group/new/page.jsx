'use client'

import VenueGroupForm from "@/components/VenueGroupForm"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

export default function NewVenueRoomPage() {
	return (
		<div className="p-6 max-w-xl">
			<Card className="shadow-xs border rounded-lg p-0">
				<CardHeader>
					<CardTitle className="text-2xl mt-4">Create New Organisation</CardTitle>
					<CardDescription>
						Fill in the details to add a new organisation.
					</CardDescription>
				</CardHeader>
				<CardContent className="p-0">
					<VenueGroupForm />
				</CardContent>
			</Card>
		</div>
	)
}
