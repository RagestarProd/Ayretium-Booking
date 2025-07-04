"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import VenueSelect from "@/components/VenueSelect";
import { toast } from "sonner";

export default function VenueGroupForm({ initialData }) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState(initialData?.name || "");

	// This will hold an array of selected venue IDs
	const [selectedVenueIds, setSelectedVenueIds] = useState(
		Array.isArray(initialData?.venues)
			? initialData.venues.map((v) => v.id)
			: []
	);

	// Sync if initialData changes
	useEffect(() => {
		if (initialData) {
			setName(initialData.name || "");
			setSelectedVenueIds(
				Array.isArray(initialData.venues)
					? initialData.venues.map((v) => v.id)
					: []
			);
		}
	}, [initialData]);

	// On form submit
	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);

		const data = {
			name,
			venueIds: selectedVenueIds,
		};

		// If initial data (then we are editing) so use patch, otherwise post for new
		const method = initialData?.id ? "PATCH" : "POST";
		const url = initialData?.id
			? `/api/venues/groups/${initialData.id}`
			: "/api/venues/groups";

		try {
			// Submit
			const res = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (res.ok) {
				toast.success(initialData ? "Organisation updated" : "Organisation created");
				router.push("/dashboard/venue/group");
			} else {
				const errorData = await res.json();
				toast.error(errorData.error?.message || "Failed to save organisation");
			}
		} catch (err) {
			toast.error(err.message || "Unexpected error");
		} finally {
			setLoading(false);
		}

	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4 max-w-xl p-4 pt-0">
			<div className="space-y-2">
				<Label htmlFor="name">Organisation Name</Label>
				<Input
					name="name"
					placeholder="Organisation Name"
					required
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>

			<div>
				<VenueSelect
					mode="multiselect"
					onVenueSelect={setSelectedVenueIds}
					selectedIdss={selectedVenueIds}
				/>
			</div>

			<Button type="submit" disabled={loading}>
				{loading ? (initialData ? "Updating..." : "Adding...") : (initialData ? "Update Organisation" : "Add Organisation")}
			</Button>
		</form>
	);
}
