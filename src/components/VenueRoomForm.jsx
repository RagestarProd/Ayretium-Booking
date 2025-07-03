"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import VenueSelect from "@/components/VenueSelect";
import { toast } from "sonner";

export default function VenueRoomForm({ initialData }) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	// Controlled state for form inputs, initialized from initialData or empty
	const [name, setName] = useState(initialData?.name || "");
	const [selectedVenueId, setSelectedVenueId] = useState(initialData?.venueId || null);

	// Optional: sync state if initialData changes (rare, but good practice)
	useEffect(() => {
		if (initialData) {
			setName(initialData.name || "");
			setSelectedVenueId(initialData.venueId || null);
		}
	}, [initialData]);

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);

		const data = {
			name,
			venueID: selectedVenueId,
		};

		// Use PATCH for update, POST for create
		const method = initialData?.id ? "PATCH" : "POST";

		const url = initialData?.id
			? `/api/venues/rooms/${initialData.id}`
			: "/api/venues/rooms";

		try {
			const res = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			setLoading(false);

			if (res.ok) {
				toast.success(initialData ? "Venue room updated" : "New venue room successfully added");
				router.push("/dashboard/venue/room");
			} else {
				const errorData = await res.json();
				toast.error(errorData.error?.message || "Failed to save venue room");
			}
		} catch (error) {
			setLoading(false);
			toast.error("Network error. Please try again.");
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4 max-w-xl p-4 pt-0">
			<div className="space-y-2">
				<Label htmlFor="name">Room Name</Label>
				<Input
					name="name"
					placeholder="Name"
					required
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>

			<VenueSelect
				mode="singleselect"
				onVenueSelect={setSelectedVenueId}
				selectedIds={selectedVenueId ? [selectedVenueId] : []}
				initialVenueId={initialData?.venueId}
			/>

			<Button type="submit" disabled={loading}>
				{loading ? (initialData ? "Updating..." : "Adding...") : (initialData ? "Update Room" : "Add Room")}
			</Button>
		</form>
	);
}
