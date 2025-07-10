import { getServerSession } from "next-auth/next";
import { authOptions } from "/src/app/api/auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';  // Next.js Response helper

const token = process.env.CURRENT_API_TOKEN;
const subdomain = process.env.NEXT_PUBLIC_CURRENT_SUBDOMAIN;

export async function POST(req) {
	// Parse incoming JSON body
	const formData = await req.json();
	const { name, street, city, county, postcode, country, venueGroupId } = formData;
	const currentRmsApiUrl = 'https://api.current-rms.com/api/v1/members';

	// TODO: AUTH CHECK — Ensure only authorised users can create venues

	// Basic validation: check required fields are present
	if (!street || !name || !city || !postcode || !country) {
		return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
	}

	// Build payload for Current RMS API
	const payload = {
		"membership_type": "Venue",   // Required to create venue in Current RMS
		"name": name,
		"primary_address_attributes": {
			"street": street,
			"postcode": postcode,
			"city": city,
			"county": county,
			"country_id": country
		},
		"active": "1",                  // Mark venue as active
		"bookable": "0",                // Not bookable by default
		"location_type": "1",           // Default location type
		"sale_tax_class_id": "1",       // Default tax class
		"purchase_tax_class_id": "1",
		"day_cost": "0.00",
		"hour_cost": "0.00",
		"distance_cost": "0.00",
		"flat_rate_cost": "0.00"
	};

	try {
		// Send request to Current RMS API to create the venue
		const res = await fetch(currentRmsApiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Auth-Token': token,
				'Accept': 'application/json',
				'X-SUBDOMAIN': subdomain
			},
			body: JSON.stringify(payload)
		});

		const data = await res.json();

		// If RMS API call fails, return its error
		if (!res.ok || !data.member?.id) {
			return NextResponse.json({ error: data }, { status: res.status || 500 });
		}

		try {
			// Add new venue to local database, using ID from RMS
			await prisma.venue.create({
				data: {
					current_id: data.member.id,     // Store the RMS ID for reference
					visible: 1,                     // Mark venue as visible by default
					name: name,                     // Store name locally
					venueGroupId: venueGroupId ? parseInt(venueGroupId, 10) : null  // Ensure this is an integer or null
				},
			});

		} catch (dbError) {
			// If DB write fails, return RMS response with DB error status
			return NextResponse.json({ error: "Failed to save venue to database." }, { status: 500 });
		}

		// If everything worked, return RMS response data to client
		return NextResponse.json(data, { status: 201 });

	} catch (err) {
		// Catch any unexpected errors and return generic error message
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
