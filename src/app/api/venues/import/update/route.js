import prisma from '@/lib/prisma'

const token = process.env.CURRENT_API_TOKEN
const subdomain = process.env.NEXT_PUBLIC_CURRENT_SUBDOMAIN

export async function GET() {
	// Get venues from DB
	const dbVenues = await prisma.venue.findMany({
		select: { id: true, current_id: true, name: true }, // include internal id for deletion
	})

	if (dbVenues.length === 0) {
		return new Response(JSON.stringify({ venues: [] }), {
			headers: { "Content-Type": "application/json" },
		})
	}

	const queryParams = dbVenues
		.map((v) => `q[id_in][]=${encodeURIComponent(v.current_id)}`)
		.join("&")

	const fullUrl = `https://api.current-rms.com/api/v1/members?filtermode=venue&${queryParams}`

	try {
		const rmsRes = await fetch(fullUrl, {
			cache: "no-store",
			headers: {
				"X-Auth-Token": token,
				Accept: "application/json",
				"X-SUBDOMAIN": subdomain,
			},
		})

		if (!rmsRes.ok) {
			throw new Error(`Failed to fetch venues: ${rmsRes.status} ${rmsRes.statusText}`)
		}

		const data = await rmsRes.json()

		const rmsVenuesById = new Map(
			(data.members || []).map((venue) => [venue.id.toString(), venue])
		)

		// Find DB venues NOT in Current RMS response
		const toDelete = dbVenues.filter(
			(v) => !rmsVenuesById.has(v.current_id.toString())
		)

		// Delete missing venues from DB (optional: batch)
		if (toDelete.length > 0) {
			const deleteIds = toDelete.map((v) => v.id)
			await prisma.venue.deleteMany({
				where: { id: { in: deleteIds } },
			})
		}

		// Update venue names in DB for existing venues
		for (const v of dbVenues) {
			const rmsVenue = rmsVenuesById.get(v.current_id.toString())
			if (rmsVenue && rmsVenue.name) {
				await prisma.venue.update({
					where: { id: v.id },
					data: { name: rmsVenue.name },
				})
			}
		}

		// Return updated venues list
		const updatedVenues = dbVenues
			.filter((v) => rmsVenuesById.has(v.current_id.toString()))
			.map(({ current_id }) => {
				const rmsVenue = rmsVenuesById.get(current_id.toString())
				return {
					id: current_id,
					name: rmsVenue ? rmsVenue.name : null,
				}
			})

		return new Response(
			JSON.stringify({ venues: updatedVenues, deletedCount: toDelete.length }),
			{ headers: { "Content-Type": "application/json" } }
		)
	} catch (error) {
		console.error("Error fetching venues from Current RMS:", error)
		return new Response(
			JSON.stringify({ error: error.message }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		)
	}
}
