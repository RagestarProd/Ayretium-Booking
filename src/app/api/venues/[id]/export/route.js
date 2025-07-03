import { getServerSession } from "next-auth/next";
import { authOptions } from "/src/app/api/auth/[...nextauth]/route"
import prisma from '@/lib/prisma'

const token = process.env.CURRENT_API_TOKEN
const subdomain = process.env.NEXT_PUBLIC_CURRENT_SUBDOMAIN


export async function PUT(req, context) {
	const params = await context.params;
	const id = params.id;
	const formData = await req.json()
	const { name, street, city, county, postcode, country } = formData
	const currentRmsApiUrl = `https://api.current-rms.com/api/v1/members/${id}`;

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
		"member": {
			"name": name,
			"primary_address_attributes": {
				"street": street,
				"postcode": postcode,
				"city": city,
				"county": county,
				"country_id": country
			}
		}
	}

	try {
		// Send to Current API
		const res = await fetch(currentRmsApiUrl, {
			method: 'PUT',
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

		return new Response(JSON.stringify(data), {
			headers: { 'Content-Type': 'application/json' },
		})

	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), { status: 500 })
	}
}