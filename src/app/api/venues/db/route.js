// API - get all venues from DB

import prisma from '@/lib/prisma'

const token = process.env.CURRENT_API_TOKEN
const subdomain = process.env.NEXT_PUBLIC_CURRENT_SUBDOMAIN

// Get all visible venues + merge data from RMS
export async function GET(req) {
	
	// Get all visible venues from DB
	const [dbVenues, total] = await Promise.all([
		prisma.venue.findMany({
			where: { visible: 1 },
			select: { id: true, current_id: true, name: true, venueGroupId: true }

		}),
		prisma.venue.count({
			where: { visible: 1 },
		}),
	])

	try {
		return new Response(
			JSON.stringify({
				data: dbVenues
			}),
			{
				headers: { 'Content-Type': 'application/json' },
			}
		)
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), { status: 500 })
	}
}
