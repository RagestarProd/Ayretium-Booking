"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { toast } from "sonner";
import { CountryList } from "@/components/CountryList";

export default function VenueForm({ initialData }) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	// Controlled country state defaults to initialData.country or '1'
	const [country, setCountry] = useState(initialData?.country || "1");

	// When initialData changes (or on mount), update country state accordingly
	useEffect(() => {
		if (initialData?.country) {
			setCountry(initialData.country);
		}
	}, [initialData]);

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);

		const form = e.currentTarget;
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());

		// Decide method and URL based on initialData presence
		const method = initialData ? "PUT" : "POST";
		const url = initialData ? `/api/venues/${initialData.current_id}/export` : "/api/venues/add";

		const res = await fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		setLoading(false);

		if (res.ok) {
			toast.success(initialData ? "Venue updated successfully" : "New venue successfully added");
			router.push("/dashboard/venue");
		} else {
			const errData = await res.json();
			toast.error(errData.error?.message || "Failed to save venue");
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4 max-w-xl p-4 pt-0">
			<div className="space-y-2">
				<Label htmlFor="name">Venue Name</Label>
				<Input
					name="name"
					placeholder="Name"
					required
					defaultValue={initialData?.name || ""}
					id="name"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="street">Primary address</Label>
				<Textarea
					name="street"
					placeholder="Street"
					required
					defaultValue={initialData?.street || ""}
					id="street"
				/>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<Input
					name="city"
					placeholder="City"
					required
					defaultValue={initialData?.city || ""}
					id="city"
				/>
				<Input
					name="county"
					placeholder="County"
					defaultValue={initialData?.county || ""}
					id="county"
				/>
				<Input
					name="postcode"
					placeholder="Postcode"
					required
					defaultValue={initialData?.postcode || ""}
					id="postcode"
				/>
			</div>

			<div className="space-y-2">
				<Select id="country" value={country.toString()} onValueChange={setCountry} required>
					<SelectTrigger>
						<SelectValue placeholder="Select a country" />
					</SelectTrigger>
					<SelectContent>
						<CountryList />
					</SelectContent>
				</Select>
			</div>

			{/* Hidden input to send country value in form submission */}
			<input type="hidden" name="country" value={country} />

			<Button type="submit" disabled={loading}>
				{loading ? (initialData ? "Updating..." : "Adding...") : (initialData ? "Update Venue" : "Add Venue")}
			</Button>
		</form>
	);
}
