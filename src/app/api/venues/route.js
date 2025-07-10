// API - get all venues from DB and pull info from Current RMS

import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'  // Next.js built-in Response helper

const token = process.env.CURRENT_API_TOKEN
const subdomain = process.env.NEXT_PUBLIC_CURRENT_SUBDOMAIN

// Get all visible venues + merge data from RMS
export async function GET(req) {
	// Parse query params from the request URL (page & per_page)
	const { searchParams } = new URL(req.url)
	const page = parseInt(searchParams.get('page') || '1', 10)         // current page number (default: 1)
	const perPage = parseInt(searchParams.get('per_page') || '100', 10) // items per page (default: 100)
	const skip = (page - 1) * perPage                                   // calculate how many items to skip for pagination

	try {
		// Get all visible venues from the local database (paginated)
		const [dbVenues, total] = await Promise.all([
			prisma.venue.findMany({
				where: { visible: 1 },      // only venues marked as visible
				skip,                      // skip for pagination
				take: perPage,              // how many items to return
				select: {                   // only select the fields we need
					id: true,
					current_id: true,
					name: true,
					venueGroupId: true
				}
			}),
			prisma.venue.count({           // get total count of visible venues
				where: { visible: 1 },
			}),
		])

		// Build query string to fetch venue details from Current RMS based on current_ids
		const queryParams = dbVenues
			.map(v => `q[id_in][]=${encodeURIComponent(v.current_id)}`)
			.join('&')

		const fullUrl = `https://api.current-rms.com/api/v1/members?filtermode=venue&${queryParams}`

		// Fetch venue details from Current RMS API
		const rmsRes = await fetch(fullUrl, {
			cache: 'no-store', // always get fresh data, no caching
			headers: {
				'X-Auth-Token': token,            // RMS auth token
				'Accept': 'application/json',
				'X-SUBDOMAIN': subdomain          // RMS subdomain
			}
		})

		const rmsData = await rmsRes.json()

		// If the RMS API call failed, return error response
		if (!rmsRes.ok) {
			return NextResponse.json({ error: rmsData }, { status: rmsRes.status })
		}

		// Merge the local DB venues with the external RMS data
		const rmsVenues = rmsData.members || []
		const finalVenues = dbVenues.map((dbVenue) => {
			const comboVenue = rmsVenues.find((m) => m.id === dbVenue.current_id) // find matching RMS venue by ID
			return {
				...dbVenue,
				name: comboVenue?.name ?? dbVenue.name ?? "Unnamed Venue",          // prefer RMS name, fall back to DB or "Unnamed"
				primary_address: comboVenue?.primary_address || null,               // pull primary address from RMS if available
			}
		})

		// Return merged venues with pagination meta as JSON using NextResponse
		return NextResponse.json({
			data: finalVenues,
			meta: {
				total,                                       // total number of venues (for pagination)
				page,                                        // current page number
				perPage,                                     // items per page
				totalPages: Math.ceil(total / perPage),      // total pages
			},
		}, {
			status: 200,
		})

	} catch (err) {
		// Catch any unexpected errors and return a 500 response using NextResponse
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}
