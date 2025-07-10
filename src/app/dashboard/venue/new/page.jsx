'use client'

import VenueForm from "@/components/VenueForm";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

export default function NewVenuePage() {
	return (
		<div className="p-6 max-w-xl">
			<Card className="shadow-xs border rounded-lg">
				<CardHeader>
					<CardTitle className="text-2xl">Create New Venue</CardTitle>
					<CardDescription>
						Fill in the details to add a new venue.
						<br />
						<strong>This venue will also be added to Current RMS</strong>
					</CardDescription>
				</CardHeader>
				<CardContent className="p-0">
					<VenueForm />
				</CardContent>
			</Card>
		</div>
	)
}
