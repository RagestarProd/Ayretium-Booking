'use client'

import VenueGroupForm from "@/components/VenueGroupForm"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

export default function NewVenueRoomPage() {
	return (
		<div className="p-6 max-w-xl">
			<Card className="shadow-xs border rounded-lg">
				<CardHeader>
					<CardTitle className="text-2xl">Create New Organisation</CardTitle>
					<CardDescription>
						Fill in the details to add a new organisation.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<VenueGroupForm />
				</CardContent>
			</Card>
		</div>
	)
}
