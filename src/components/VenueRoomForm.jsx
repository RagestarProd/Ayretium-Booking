"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import { IconBuildingStore, IconDoor } from '@tabler/icons-react'; // Icons for Venue and Room

import VenueSelect from "@/components/VenueSelect";

export default function VenueRoomForm({ initialData }) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	// Controlled state for form inputs, initialized from initialData or empty
	const [name, setName] = useState(initialData?.name || "");
	const [selectedVenueId, setSelectedVenueId] = useState(initialData?.venueId || null);

	// Sync state if initialData changes
	useEffect(() => {
		if (initialData) {
			setName(initialData.name || "");
			setSelectedVenueId(initialData.venueId || null);
		}
	}, [initialData]);

	// Handle form submission: POST to create, PATCH to update venue room
	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);

		const data = {
			name,
			venueID: selectedVenueId,
		};

		const method = initialData?.id ? "PATCH" : "POST";
		const url = initialData?.id
			? `/api/venues/rooms/${initialData.id}`
			: "/api/venues/rooms";

		try {
			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
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
		<form onSubmit={handleSubmit} className="p-0 max-w-xl mx-auto">
			<Table>
				<TableBody>
					{/* Room Name Row with top border only */}
					<TableRow className="border-t border-border px-4">
						<TableCell className="w-1/3 px-4 py-3">
							<Label htmlFor="name" className="flex items-center">
								<IconDoor className="w-5 h-5 mr-2 text-gray-600" />
								Room Name
							</Label>
						</TableCell>
						<TableCell className="px-4 py-3">
							<Input
								id="name"
								name="name"
								placeholder="Name"
								required
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</TableCell>
					</TableRow>

					{/* Venue Select Row */}
					<TableRow className="px-4">
						<TableCell className="px-4 py-3">
							<Label className="flex items-center">
								<IconBuildingStore className="w-5 h-5 mr-2 text-gray-600" />
								Venue
							</Label>
						</TableCell>
						<TableCell className="px-4 py-3">
							<VenueSelect
								mode="singleselect"
								onVenueSelect={setSelectedVenueId}
								selectedIds={selectedVenueId ? [selectedVenueId] : []}
								initialVenueId={initialData?.venueId}
							/>
						</TableCell>
					</TableRow>

					{/* Submit button */}
					<TableRow className="px-4">
						<TableCell colSpan={2} className="px-4 py-4 text-right">
							<Button type="submit" disabled={loading}>
								{loading
									? (initialData ? "Updating..." : "Adding...")
									: (initialData ? "Update Room" : "Add Room")}
							</Button>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</form>
	);
}
