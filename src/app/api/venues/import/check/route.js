import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get all visible venues from DB and return their RMS ID
export async function GET() {
	const venues = await prisma.venue.findMany({
		where: { visible: 1 },
		select: { current_id: true },
	});
	const currentIds = venues.map(v => v.current_id);
	return new Response(JSON.stringify({ currentIds }), {
		headers: { 'Content-Type': 'application/json' },
	})
}

export async function POST(req) {
	try {
		const { currentIDs } = await req.json()
		if (!Array.isArray(currentIDs)) {
			return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 })
		}

		// Query DB for venues with these IDs
		const venues = await prisma.venue.findMany({
			where: { current_id: { in: currentIDs } },
			select: { current_id: true, visible: true },
		})

		const existingIds = venues.map(v => ({
			id: v.current_id,
			visible: v.visible,
		}))
		return new Response(JSON.stringify({ existingIds }), {
			headers: { 'Content-Type': 'application/json' },
		})
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), { status: 500 })
	}
}
