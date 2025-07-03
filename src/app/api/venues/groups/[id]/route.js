import prisma from '@/lib/prisma'

export async function GET(request, context) {
	const params = await context.params;
	const { id } = params;

	const groupId = Number(id);

	if (isNaN(groupId)) {
		return new Response(JSON.stringify({ error: "Invalid group id" }), { status: 400 });
	}

	try {
		const venueGroup = await prisma.venueGroup.findUnique({
			where: { id: groupId },
			// Include related data if applicable, e.g., venues:
			include: { venues: true },
		});

		if (!venueGroup) {
			return new Response(JSON.stringify({ error: "Venue group not found" }), { status: 404 });
		}

		return new Response(JSON.stringify(venueGroup), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), { status: 500 });
	}
}


export async function POST(request, context) {
	const params = await context.params;
	const id = params.id;
	const groupId = Number(id);

	if (isNaN(groupId)) {
		return new Response(JSON.stringify({ error: "Invalid group id" }), { status: 400 });
	}

	try {
		const body = await request.json();
		const { name } = body;

		if (!name) {
			return new Response(JSON.stringify({ error: "Missing or invalid fields" }), { status: 400 });
		}

		const updatedGroup = await prisma.venueGroup.update({
			where: { id: groupId },
			data: {
				name,
				// Add other fields here if you want to update more
			},
		});

		return new Response(JSON.stringify({ updatedGroup }), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), { status: 500 });
	}
}


export async function PATCH(request, context) {
	const params = await context.params;
	const id = params.id;
	const groupId = Number(id);

	if (isNaN(groupId)) {
		return new Response(JSON.stringify({ error: "Invalid group id" }), { status: 400 });
	}

	try {
		const body = await request.json();

		const { name, venueIds } = body; // Assume venueIds is an optional array of venue IDs

		// Validate input if needed
		if (name !== undefined && typeof name !== "string") {
			return new Response(JSON.stringify({ error: "Invalid name" }), { status: 400 });
		}
		if (venueIds !== undefined && !Array.isArray(venueIds)) {
			return new Response(JSON.stringify({ error: "venueIds must be an array" }), { status: 400 });
		}

		// Build data object dynamically
		const dataToUpdate = {};
		if (name) dataToUpdate.name = name;

		// If venueIds provided, update relations via connect/disconnect
		if (venueIds) {
			// Disconnect all current venues first, then connect new ones
			dataToUpdate.venues = {
				set: venueIds.map(id => ({ id })),
			};
		}

		const updatedGroup = await prisma.venueGroup.update({
			where: { id: groupId },
			data: dataToUpdate,
			include: { venues: true },
		});
		console.log(updatedGroup)

		return new Response(JSON.stringify({ updatedGroup }), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), { status: 500 });
	}
}