// API - get all venues from DB and pull info from Current RMS

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const token = process.env.CURRENT_API_TOKEN
const subdomain = process.env.NEXT_PUBLIC_CURRENT_SUBDOMAIN

// Get all visible venues + merge data from RMS
export async function GET(req) {
	const { searchParams } = new URL(req.url)
	const page = parseInt(searchParams.get('page') || '1', 10)
	const perPage = parseInt(searchParams.get('per_page') || '20', 10)
	const skip = (page - 1) * perPage

	// Get all visible venues from DB
	const [venues, total] = await Promise.all([
		prisma.venue.findMany({
			where: { visible: 1 },
			skip,
			take: perPage,
		}),
		prisma.venue.count({
			where: { visible: 1 },
		}),
	])


	// Build query with all IDs we just got
	const queryParams = venues.map(v => `q[id_in][]=${encodeURIComponent(v.current_id)}`).join('&')
	const fullUrl = `https://api.current-rms.com/api/v1/members?filtermode=venue&${queryParams}`

	// Get the venue info from Current RMS
	try {
		const res = await fetch(fullUrl, {
			cache: 'no-store',
			headers: {
				'X-Auth-Token': token,
				'Accept': 'application/json',
				'X-SUBDOMAIN': subdomain
			}
		})

		const data = await res.json()

		if (!res.ok) {
			return new Response(JSON.stringify({ error: data }), { status: res.status })
		}

		// Merge DB venues and Current RMS venues
		const currentVenues = data.members || []
		const merged = venues.map((venue) => {
			const current = currentVenues.find((m) => m.id === venue.current_id)
			return {
				...venue,
				name: current?.name || null,
				primary_address: current?.primary_address || null,
			}
		})

		return new Response(
			JSON.stringify({
				data: merged,
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
