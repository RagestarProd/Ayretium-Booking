'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import { CountryList } from "@/components/CountryList";
import VenueGroupSelect from "@/components/VenueGroupSelect";
import { IconHome, IconMapPin, IconMap, IconFlag, IconBuilding } from '@tabler/icons-react';

export default function VenueForm({ initialData }) {

	const router = useRouter();
	const [loading, setLoading] = useState(false);

	// State for controlled inputs
	const [country, setCountry] = useState(initialData?.country || "1");
	const [venueGroup, setVenueGroup] = useState(initialData?.venueGroupId?.toString() || "");

	// Prefill fields if initialData updates (useful for edits)
	useEffect(() => {
		if (initialData?.country) setCountry(initialData.country);
		if (initialData?.venueGroupId) setVenueGroup(initialData.venueGroupId.toString());
	}, [initialData]);

	// Handle form submission
	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);

		const form = e.currentTarget;
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());

		// Append controlled values
		data.venueGroupId = venueGroup || null;
		data.visibilityStatus = true;

		// Choose method and endpoint
		const method = initialData ? "PUT" : "POST";
		const url = initialData ? `/api/venues/${initialData.current_id}/export` : "/api/venues/add";

		try {
			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (res.ok) {
				toast.success(initialData ? "Venue updated successfully" : "New venue successfully added");
				router.push("/dashboard/venue");
			} else {
				const errData = await res.json();
				toast.error(errData.error?.message || "Failed to save venue");
			}
		} catch (err) {
			toast.error(err.message || "Unexpected error");
		} finally {
			setLoading(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="p-0">
			<Table>
				<TableBody>

					{/* Venue Name */}
					<TableRow className="border-t border-border px-4">
						<TableCell className="w-1/3 px-4 py-3">
							<Label htmlFor="name" className="flex items-center">
								<IconHome className="w-4 h-4 mr-2" /> Venue Name
							</Label>
						</TableCell>
						<TableCell className="px-4 py-3">
							<Input
								name="name"
								id="name"
								placeholder="Venue Name"
								required
								defaultValue={initialData?.name || ""}
							/>
						</TableCell>
					</TableRow>

					{/* Address */}
					<TableRow className="px-4">
						<TableCell className="px-4 py-3">
							<Label htmlFor="street" className="flex items-center">
								<IconMapPin className="w-4 h-4 mr-2" /> Primary Address
							</Label>
						</TableCell>
						<TableCell className="px-4 py-3">
							<Textarea
								name="street"
								id="street"
								placeholder="Street Address"
								required
								defaultValue={initialData?.street || ""}
							/>
						</TableCell>
					</TableRow>

					{/* City / County / Postcode */}
					<TableRow className="px-4">
						<TableCell className="px-4 py-3">
							<Label className="flex items-center">
								<IconMap className="w-4 h-4 mr-2" /> Address
							</Label>
						</TableCell>
						<TableCell className="px-4 py-3">
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
								<Input
									name="city"
									placeholder="City"
									required
									defaultValue={initialData?.city || ""}
								/>
								<Input
									name="county"
									placeholder="County"
									defaultValue={initialData?.county || ""}
								/>
								<Input
									name="postcode"
									placeholder="Postcode"
									required
									defaultValue={initialData?.postcode || ""}
								/>
							</div>
						</TableCell>
					</TableRow>

					{/* Country */}
					<TableRow className="px-4">
						<TableCell className="px-4 py-3">
							<Label className="flex items-center">
								<IconFlag className="w-4 h-4 mr-2" /> Country
							</Label>
						</TableCell>
						<TableCell className="px-4 py-3">
							<Select id="country" value={country.toString()} onValueChange={setCountry} required>
								<SelectTrigger>
									<SelectValue placeholder="Select a country" />
								</SelectTrigger>
								<SelectContent>
									<CountryList />
								</SelectContent>
							</Select>
						</TableCell>
					</TableRow>

					{/* Organisation / Venue Group */}
					<TableRow className="px-4">
						<TableCell className="px-4 py-3">
							<Label className="flex items-center">
								<IconBuilding className="w-4 h-4 mr-2" /> Organisation
							</Label>
						</TableCell>
						<TableCell className="px-4 py-3">
							<VenueGroupSelect value={venueGroup} onChange={setVenueGroup} />
						</TableCell>
					</TableRow>

					{/* Hidden fields */}
					<input type="hidden" name="country" value={country} />
					<input type="hidden" name="venueGroupId" value={venueGroup} />

					{/* Submit */}
					<TableRow className="px-4">
						<TableCell colSpan={2} className="px-4 py-4 text-right">
							<Button type="submit" disabled={loading}>
								{loading ? (initialData ? "Updating..." : "Adding...") : (initialData ? "Update Venue" : "Add Venue")}
							</Button>
						</TableCell>
					</TableRow>

				</TableBody>
			</Table>
		</form>
	);
}
