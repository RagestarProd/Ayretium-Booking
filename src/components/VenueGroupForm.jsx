"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // or useRouter from next/router if pages directory
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import VenueSelect from "@/components/VenueSelect";
import { toast } from "sonner"

export default function VenueForm() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [selectedVenueIds, setSelectedVenueIds] = useState([])

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);

		// Get form data		
		const form = e.currentTarget;
		const formData = new FormData(form);
		const data = {
			...Object.fromEntries(formData.entries()),
			venueIDs: selectedVenueIds,
		}

		// Submit
		const res = await fetch("/api/venues/groups", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		setLoading(false);

		if (res.ok) {
			toast.success("New venue group successfully added");
			router.push("/dashboard/venue/group");
		} else {
			const data = await res.json();
			toast.error(data.error.message || "Failed to create venue group");
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4 max-w-xl p-4">
			<div className="space-y-2">
				<Label htmlFor="name">Venue Group Name</Label>
				<Input name="name" placeholder="Name" required />
			</div>
			<VenueSelect onVenueSelect={setSelectedVenueIds} />
			<Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Venue Group'}</Button>

		</form>
	);
}
