import prisma from '@/lib/prisma'

const token = process.env.CURRENT_API_TOKEN
const subdomain = process.env.NEXT_PUBLIC_CURRENT_SUBDOMAIN

// Get one venue by ID, merging DB and Current RMS data
export async function GET(request, context) {
	try {
		const params = await context.params;
		const id = params.id;
		const venueId = Number(id)
		if (isNaN(venueId)) {
			return new Response(JSON.stringify({ error: "Invalid venue ID" }), { status: 400 })
		}

		// Find venue in DB by current_id (assuming current_id is numeric and unique)
		const dbVenue = await prisma.venue.findUnique({
			where: { id: venueId },
		})

		if (!dbVenue) {
			return new Response(JSON.stringify({ error: "Venue not found" }), { status: 404 })
		}

		// Fetch venue data from Current RMS API for this venue only
		const url = `https://api.current-rms.com/api/v1/members?filtermode=venue&q[id_in][]=${encodeURIComponent(dbVenue.current_id)}`

		const rmsRes = await fetch(url, {
			cache: 'no-store',
			headers: {
				'X-Auth-Token': token,
				'Accept': 'application/json',
				'X-SUBDOMAIN': subdomain,
			},
		})

		const rmsData = await rmsRes.json()

		if (!rmsRes.ok) {
			return new Response(JSON.stringify({ error: rmsData }), { status: rmsRes.status })
		}
		
		const rmsVenue = (rmsData.members && rmsData.members[0]) || null

		// Merge DB and RMS data
		const combinedVenue = {
			...dbVenue,
			name: rmsVenue?.name || null,
			postcode: rmsVenue?.primary_address.postcode || null,
			county: rmsVenue?.primary_address.county || null,
			city: rmsVenue?.primary_address.city || null,
			street: rmsVenue?.primary_address.street || null,
			country: rmsVenue?.primary_address.country_id || null,
		}

		return new Response(JSON.stringify(combinedVenue), {
			headers: { 'Content-Type': 'application/json' },
		})
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), { status: 500 })
	}
}
