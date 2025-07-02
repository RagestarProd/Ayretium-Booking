import { getServerSession } from "next-auth/next";
import { authOptions } from "/src/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
const token = process.env.CURRENT_API_TOKEN
const subdomain = process.env.NEXT_PUBLIC_CURRENT_SUBDOMAIN

const prisma = new PrismaClient()

export async function POST(req) {
	const formData = await req.json()
	const { name, street, city, county, postcode, country } = formData
	const currentRmsApiUrl = 'https://api.current-rms.com/api/v1/members';

	//TODO AUTH CHECK

	// Validation
	if (!street || !name || !city || !postcode || !country) {
		return new Response(JSON.stringify({ error: "Missing required fields" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		})
	}

	// Build payload
	const payload = {
		"membership_type": "Venue",
		"name": name,
		"primary_address_attributes": {
			"street": street,
			"postcode": postcode,
			"city": city,
			"county": county,
			"country_id": country
		},
		"active": "1",
		"bookable": "0",
		"location_type": "1",
		"sale_tax_class_id": "1",
		"purchase_tax_class_id": "1",
		"day_cost": "0.00",
		"hour_cost": "0.00",
		"distance_cost": "0.00",
		"flat_rate_cost": "0.00"
	}


	try {
		// Send to Current API
		const res = await fetch(currentRmsApiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Auth-Token': token,
				'Accept': 'application/json',
				'X-SUBDOMAIN': subdomain
			},
			body: JSON.stringify(payload)
		})

		const data = await res.json()

		if (!res.ok) {
			return new Response(JSON.stringify({ error: data }), { status: res.status })
		}

		try {
			// Add venue to DB
			await prisma.venue.create({
				data: {
					current_id: data.member.id,
					visible: 1
				},
			});

		} catch (error) {
			return new Response(JSON.stringify({ error: data }), { status: res.status })
		}

		return new Response(JSON.stringify(data), {
			headers: { 'Content-Type': 'application/json' },
		})

	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), { status: 500 })
	}
}