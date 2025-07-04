import prisma from '@/lib/prisma'


// Get a venue room by ID
export async function GET(request, context) {
	const params = await context.params;
	const { id } = params;

	const roomId = Number(id);
	if (isNaN(roomId)) {
		return new Response(JSON.stringify({ error: "Invalid room id" }), { status: 400 });
	}

	try {
		const venueRoom = await prisma.venueRoom.findUnique({
			where: { id: roomId },
			include: { venue: true },
		});

		if (!venueRoom) {
			return new Response(JSON.stringify({ error: "Venue room not found" }), { status: 404 });
		}

		return new Response(JSON.stringify(venueRoom), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), { status: 500 });
	}
}

// Update an existing venue room by ID
export async function PATCH(request, context) {
	const params = await context.params;
	const { id } = params;

	const roomId = Number(id);
	if (isNaN(roomId)) {
		return new Response(JSON.stringify({ error: "Invalid room id" }), { status: 400 });
	}

	try {
		const body = await request.json();
		const { name, venueID } = body;
		const venueIdNum = Number(venueID);

		if (!name || isNaN(venueIdNum)) {
			return new Response(JSON.stringify({ error: "Missing or invalid fields" }), { status: 400 });
		}

		const updatedRoom = await prisma.venueRoom.update({
			where: { id: roomId },
			data: {
				name,
				venueId: venueIdNum,
			},
			include: { venue: true },
		});


		return new Response(JSON.stringify({ updatedRoom }), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), { status: 500 });
	}
}

// Create a new venue room
export async function POST(request) {
	try {
		const body = await request.json();
		const { name, venueID } = body;
		const venueIdNum = Number(venueID);

		if (!name || isNaN(venueIdNum)) {
			return new Response(JSON.stringify({ error: "Missing or invalid fields" }), { status: 400 });
		}
		const newRoom = await prisma.venueRoom.create({
			data: {
				name,
				venueId: venueIdNum,
			},
			include: { venue: true },
		});

		return new Response(JSON.stringify({ newRoom }), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), { status: 500 });
	}
}

// Hard delete a venue room by ID
export async function DELETE(request, context) {
	const params = await context.params;
	const { id } = params;

	const roomId = Number(id);
	if (isNaN(roomId)) {
		return new Response(JSON.stringify({ error: "Invalid room id" }), { status: 400 });
	}

	try {
		const deletedRoom = await prisma.venueRoom.delete({
			where: { id: roomId },
		});

		return new Response(JSON.stringify({ success: true, room: deletedRoom }), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), { status: 500 });
	}
}
