"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select"
import { toast } from "sonner"
import { CountryList } from "@/components/CountryList"


export default function VenueForm() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [country, setCountry] = useState("1")

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);

		// Get form data
		const form = e.currentTarget;
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());

		// Send form data to API
		const res = await fetch("/api/venues/add", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		setLoading(false);

		if (res.ok) {
			toast.success("New venue successfully added");
			router.push("/dashboard/venue");
		} else {
			const data = await res.json();
			toast.error(data.error.message || "Failed to create venue");
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4 max-w-xl p-4">
			<div className="space-y-2">
				<Label htmlFor="street">Venue Name</Label>
				<Input name="name" placeholder="Name" required />
			</div>

			<div className="space-y-2">
				<Label htmlFor="street">Primary address</Label>
				<Textarea name="street" placeholder="Street" required />
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<Input name="city" placeholder="City" required />
				<Input name="county" placeholder="County" />
				<Input name="postcode" placeholder="Postcode" required />
			</div>

			<div className="space-y-2">
				<Select id="country" value={country} onValueChange={setCountry} required>
					<SelectTrigger>
						<SelectValue placeholder="Select a country" />
					</SelectTrigger>
					<SelectContent>
						<CountryList />
					</SelectContent>
				</Select>
			</div>

			<input type="hidden" name="country" value={country} />

			<Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Venue'}</Button>

		</form>
	);
}
