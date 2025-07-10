import { getServerSession } from "next-auth/next";
import { authOptions } from "/src/app/api/auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

const token = process.env.CURRENT_API_TOKEN;
const subdomain = process.env.NEXT_PUBLIC_CURRENT_SUBDOMAIN;

export async function PUT(req, context) {
	const params = await context.params;
	const id = Number(params?.id); // Convert safely

	if (!id) {
		return NextResponse.json({ error: "Invalid venue ID" }, { status: 400 });
	}

	const formData = await req.json();
	const { name, street, city, county, postcode, country, venueGroupId, visibilityStatus } = formData;

	if (!street || !name || !city || !postcode || !country) {
		return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
	}

	const currentRmsApiUrl = `https://api.current-rms.com/api/v1/members/${id}`;

	const payload = {
		member: {
			name: name,
			primary_address_attributes: {
				street,
				postcode,
				city,
				county,
				country_id: country,
			},
		},
	};

	try {
		// Call Current RMS API
		const res = await fetch(currentRmsApiUrl, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'X-Auth-Token': token,
				'Accept': 'application/json',
				'X-SUBDOMAIN': subdomain,
			},
			body: JSON.stringify(payload),
		});

		const data = await res.json();

		if (!res.ok) {
			console.error('Current RMS API error:', data);
			return NextResponse.json({ error: data }, { status: res.status });
		}

		const visible = visibilityStatus === true || visibilityStatus === 1 ? 1 : 0;
		const parsedVenueGroupId = venueGroupId !== undefined && venueGroupId !== null ? parseInt(venueGroupId, 10) : null;

		const venue = await prisma.venue.upsert({
			where: { current_id: id },
			update: {
				visible,
				name,
				venueGroupId: parsedVenueGroupId ?? null,
			},
			create: {
				current_id: id,
				visible,
				name,
				venueGroupId: parsedVenueGroupId ?? null,
			},
		});

		return NextResponse.json(venue, { status: 200 });

	} catch (error) {
		console.error('API PUT /venues error:', error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
