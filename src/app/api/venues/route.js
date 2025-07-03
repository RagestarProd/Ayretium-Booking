// API - get all venues from DB and pull info from Current RMS

import prisma from '@/lib/prisma'

const token = process.env.CURRENT_API_TOKEN
const subdomain = process.env.NEXT_PUBLIC_CURRENT_SUBDOMAIN

// Get all visible venues + merge data from RMS
export async function GET(req) {
	const { searchParams } = new URL(req.url)
	const page = parseInt(searchParams.get('page') || '1', 10)
	const perPage = parseInt(searchParams.get('per_page') || '20', 10)
	const skip = (page - 1) * perPage

	// Get all visible venues from DB
	const [dbVenues, total] = await Promise.all([
		prisma.venue.findMany({
			where: { visible: 1 },
			skip,
			take: perPage,
			select: { id: true, current_id: true, name: true }

		}),
		prisma.venue.count({
			where: { visible: 1 },
		}),
	])

	// Build query with all IDs we just got
	const queryParams = dbVenues.map(v => `q[id_in][]=${encodeURIComponent(v.current_id)}`).join('&')
	const fullUrl = `https://api.current-rms.com/api/v1/members?filtermode=venue&${queryParams}`

	// Get the venue info from Current RMS
	try {
		const rmsRes = await fetch(fullUrl, {
			cache: 'no-store',
			headers: {
				'X-Auth-Token': token,
				'Accept': 'application/json',
				'X-SUBDOMAIN': subdomain
			}
		})

		const rmsData = await rmsRes.json()

		if (!rmsRes.ok) {
			return new Response(JSON.stringify({ error: rmsData }), { status: rmsRes.status })
		}

		// Merge DB venues and Current RMS venues
		const rmsVenues = rmsData.members || []
		const finalVenues = dbVenues.map((dbVenue) => {
			const comboVenue = rmsVenues.find((m) => m.id === dbVenue.current_id)
			return {
				...dbVenue,
				name: comboVenue?.name ?? dbVenue.name ?? "Unnamed Venue",
				primary_address: comboVenue?.primary_address || null,
			}
		})

		return new Response(
			JSON.stringify({
				data: finalVenues,
				meta: {
					total,
					page,
					perPage,
					totalPages: Math.ceil(total / perPage),
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
