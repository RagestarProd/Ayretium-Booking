"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import { IconBuilding, IconBuildingStore } from "@tabler/icons-react";

import VenueSelect from "@/components/VenueSelect";

export default function VenueGroupForm({ initialData }) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	// I'm managing the organisation name input
	const [name, setName] = useState(initialData?.name || "");

	// I'm managing the list of selected venue IDs
	const [selectedVenueIds, setSelectedVenueIds] = useState(
		Array.isArray(initialData?.venues) ? initialData.venues.map((v) => v.id) : []
	);

	// I ensure my form state updates if initialData changes
	useEffect(() => {
		if (initialData) {
			setName(initialData.name || "");
			setSelectedVenueIds(
				Array.isArray(initialData.venues) ? initialData.venues.map((v) => v.id) : []
			);
		}
	}, [initialData]);

	// On submit I send either POST or PATCH based on whether I'm editing or adding
	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);

		const data = {
			name,
			venueIds: selectedVenueIds,
		};

		const method = initialData?.id ? "PATCH" : "POST";
		const url = initialData?.id
			? `/api/venues/groups/${initialData.id}`
			: "/api/venues/groups";

		try {
			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
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
		<form onSubmit={handleSubmit} className="p-0 max-w-xl mx-auto">
			<Table>
				<TableBody>

					{/* Organisation Name Row */}
					<TableRow className="border-t border-border px-4">
						<TableCell className="w-1/3 px-4 py-3">
							<Label htmlFor="name" className="flex items-center">
								<IconBuilding className="w-5 h-5 mr-2 text-gray-600" />
								Organisation Name
							</Label>
						</TableCell>
						<TableCell className="px-4 py-3">
							<Input
								id="name"
								name="name"
								placeholder="Organisation Name"
								required
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</TableCell>
					</TableRow>

					{/* Venue Multi-Select Full Width */}
					<TableRow className="px-4">
						<TableCell colSpan={2} className="px-4 py-3">
							<Label className="flex items-center mb-2">
								<IconBuildingStore className="w-5 h-5 mr-2 text-gray-600" />
								Venues
							</Label>
							<div className="w-full max-w-full overflow-hidden">
								<VenueSelect
									mode="multiselect"
									onVenueSelect={setSelectedVenueIds}
									selectedIdss={selectedVenueIds}
								/>
							</div>
						</TableCell>
					</TableRow>

					{/* Submit Button Row */}
					<TableRow className="px-4">
						<TableCell colSpan={2} className="px-4 py-4 text-right">
							<Button type="submit" disabled={loading}>
								{loading
									? (initialData ? "Updating..." : "Adding...")
									: (initialData ? "Update Organisation" : "Add Organisation")}
							</Button>
						</TableCell>
					</TableRow>

				</TableBody>
			</Table>
		</form>
	);
}
