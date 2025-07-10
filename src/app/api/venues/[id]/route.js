import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'  // Next.js built-in Response helper

const token = process.env.CURRENT_API_TOKEN
const subdomain = process.env.NEXT_PUBLIC_CURRENT_SUBDOMAIN

// Get one venue by ID, merging DB and Current RMS data
export async function GET(request, context) {
	try {
		// Extract the dynamic route parameter (:id) from the request context
		const params = await context.params;
		const id = params.id;
		const venueId = Number(id);

		// Validate the ID - must be a valid number
		if (isNaN(venueId)) {
			return NextResponse.json({ error: "Invalid venue ID" }, { status: 400 });
		}

		// Look up the venue in the local database by its internal ID
		const dbVenue = await prisma.venue.findUnique({
			where: { id: venueId },
		});

		// If no matching venue found, return a 404 error
		if (!dbVenue) {
			return NextResponse.json({ error: "Venue not found" }, { status: 404 });
		}

		// Build the Current RMS API URL to fetch details for just this venue by its current RMS ID
		const url = `https://api.current-rms.com/api/v1/members?filtermode=venue&q[id_in][]=${encodeURIComponent(dbVenue.current_id)}`;

		// Call the Current RMS API to get the latest venue data
		const rmsRes = await fetch(url, {
			cache: 'no-store', // ensure we always get fresh data
			headers: {
				'X-Auth-Token': token,        // RMS API authentication token
				'Accept': 'application/json',
				'X-SUBDOMAIN': subdomain,     // RMS subdomain for multi-tenant separation
			},
		});

		const rmsData = await rmsRes.json();

		// If RMS API call failed, return the error response with appropriate status
		if (!rmsRes.ok) {
			return NextResponse.json({ error: rmsData }, { status: rmsRes.status });
		}

		// Extract the RMS venue details (we expect a single venue back)
		const rmsVenue = (rmsData.members && rmsData.members[0]) || null;

		// Merge the local DB venue and the RMS venue into one combined object
		const combinedVenue = {
			...dbVenue,
			name: rmsVenue?.name || null,                             // Prefer RMS name if available
			postcode: rmsVenue?.primary_address?.postcode || null,
			county: rmsVenue?.primary_address?.county || null,
			city: rmsVenue?.primary_address?.city || null,
			street: rmsVenue?.primary_address?.street || null,
			country: rmsVenue?.primary_address?.country_id || null,
		};

		// Return the combined venue data as JSON using NextResponse
		return NextResponse.json(combinedVenue, { status: 200 });

	} catch (err) {
		// Catch any unexpected errors and return a 500 error response using NextResponse
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
