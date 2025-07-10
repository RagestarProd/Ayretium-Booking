import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';  // Next.js response helper

const token = process.env.CURRENT_API_TOKEN;
const subdomain = process.env.NEXT_PUBLIC_CURRENT_SUBDOMAIN;

// Get all RMS venues + merge with DB data
export async function GET(req) {
	// Extract pagination parameters from request URL
	const { searchParams } = new URL(req.url);
	const page = parseInt(searchParams.get('page') || '1', 10); // Default to page 1
	const perPage = parseInt(searchParams.get('per_page') || '20', 10); // Default to 20 items per page

	// Build full RMS API URL for venues
	const fullUrl = `https://api.current-rms.com/api/v1/members?filtermode=venue&page=${page}&per_page=${perPage}`;

	try {
		// Fetch venues from Current RMS API
		const rmsRes = await fetch(fullUrl, {
			cache: 'no-store', // Don't cache for fresh data
			headers: {
				'X-Auth-Token': token,
				Accept: 'application/json',
				'X-SUBDOMAIN': subdomain,
			},
		});

		const rmsData = await rmsRes.json();
		const rmsVenues = rmsData.members || [];
		const venueCount = rmsData.meta?.total_row_count || 0;

		// If RMS API call failed, return the RMS error
		if (!rmsRes.ok) {
			return NextResponse.json({ error: rmsData }, { status: rmsRes.status });
		}

		// Fetch all venues from your database (only minimal fields)
		const dbVenues = await prisma.venue.findMany({
			select: { id: true, current_id: true, name: true, visible: true },
		});

		// Map DB venues to a Map for fast lookup by Current RMS ID
		const dbVenueMap = new Map(dbVenues.map((v) => [v.current_id, v]));

		// Merge RMS venue data with local DB visibility status
		const mergedVenues = rmsVenues.map((rmsVenue) => {
			const dbVenue = dbVenueMap.get(rmsVenue.id);
			return {
				...rmsVenue,
				visible: dbVenue?.visible == true,
			};
		});

		// Return merged venue list with pagination meta
		return NextResponse.json({
			data: mergedVenues,
			meta: {
				total: venueCount,
				page,
				perPage,
				totalPages: Math.ceil(venueCount / perPage),
			},
		}, { status: 200 });

	} catch (err) {
		// Catch and return any unexpected server errors
		return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
	}
}
