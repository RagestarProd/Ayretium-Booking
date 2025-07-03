import prisma from '@/lib/prisma'

// Get all venue groups from DB
export async function GET() {
	const venueGroups = await prisma.venueGroup.findMany({
		include: {
			venues: true,
		},
	});

	return new Response(JSON.stringify(venueGroups), {
		headers: { 'Content-Type': 'application/json' },
	})
}

// Add new venue group to DB
export async function POST(req) {
	try {
		const body = await req.json();
		const { name, venueIDs } = body;

		// Insert venue group in DB
		const newGroup = await prisma.venueGroup.create({
			data: { name }
		});

		// Update all venues with venue group
		await prisma.venue.updateMany({
			where: {
				id: { in: venueIds }
			},
			data: {
				venueGroupId: newGroup.id
			},
		});

		return new Response(JSON.stringify({ newGroup }), {
			headers: { 'Content-Type': 'application/json' },
		})
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), { status: 500 })
	}
}