import prisma from '@/lib/prisma'


// Get all venue rooms from DB
export async function GET() {
	const venueRooms = await prisma.venueRoom.findMany({
		include: {
			venue: true,
		},
	});
	
	return new Response(JSON.stringify(venueRooms), {
		headers: { 'Content-Type': 'application/json' },
	})
}

// Add new venue room to DB
export async function POST(req) {
	try {
		const body = await req.json();
		const { name, venueID } = body;
		const venueIDs = Number(venueID);

		// Insert venue room in DB
		const newRoom = await prisma.venueRoom.create({
			data: {
					name: name,
					venueId: venueIDs
				},
		});

		return new Response(JSON.stringify({ newRoom }), {
			headers: { 'Content-Type': 'application/json' },
		})
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), { status: 500 })
	}
}