// API - Get all venues from RMS and combine with DB data

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const token = process.env.CURRENT_API_TOKEN
const subdomain = process.env.NEXT_PUBLIC_CURRENT_SUBDOMAIN

// Get all RMS venues + merge with DB data
export async function GET(req) {

	// Build RMS API URL with pagination
	const { searchParams } = new URL(req.url)
	const page = parseInt(searchParams.get('page') || '1', 10)
	const perPage = parseInt(searchParams.get('per_page') || '20', 10)
	const fullUrl = `https://api.current-rms.com/api/v1/members?filtermode=venue&page=${page}&per_page=${perPage}`

	// Get the venue info from Current RMS
	try {
		// Fetch RMS venues
		const rmsRes = await fetch(fullUrl, {
			cache: 'no-store',
			headers: {
				'X-Auth-Token': token,
				Accept: 'application/json',
				'X-SUBDOMAIN': subdomain,
			},
		})
		const rmsData = await rmsRes.json()
		const rmsVenues = rmsData.members || []
		const venueCount = rmsData.meta?.total_row_count || 0

		if (!rmsRes.ok) {
			return new Response(JSON.stringify({ error: rmsData }), { status: rmsRes.status })
		}

		// Get all venues from DB
		const dbVenues = await prisma.venue.findMany()

		// Map DB venues to array keyed with RMS ID
		const dbVenueMap = new Map(dbVenues.map((v) => [v.current_id, v]))

		// Merge rmsVenues with visible from dbVenues
		const mergedVenues = rmsVenues.map((rmsVenue) => {
			const dbVenue = dbVenueMap.get(rmsVenue.id)
			return {
				...rmsVenue,
				visible: dbVenue ? dbVenue.visible : null, // or default value
			}
		})

		// Now you can return mergedVenues or use them as needed
		return new Response(
			JSON.stringify({
				data: mergedVenues,
				meta: {
					total: venueCount,
					page,
					perPage,
					totalPages: Math.ceil(venueCount / perPage),
				},
			}),
			{
				headers: { 'Content-Type': 'application/json' },
			}
		)

	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), { status: 500 })
	}
}
