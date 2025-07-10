import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';  // Next.js built-in response helper

// Get venue group by ID
export async function GET(request, context) {
	const params = await context.params;
	const { id } = params;

	const groupId = Number(id);

	// Validate that ID is numeric
	if (isNaN(groupId)) {
		return NextResponse.json({ error: "Invalid group id" }, { status: 400 });
	}

	try {
		// Fetch venue group by ID including its related venues
		const venueGroup = await prisma.venueGroup.findUnique({
			where: { id: groupId },
			include: { venues: true }, // Include venues for this group
		});

		// If no venue group found, return 404
		if (!venueGroup) {
			return NextResponse.json({ error: "Venue group not found" }, { status: 404 });
		}

		// Return the venue group data
		return NextResponse.json(venueGroup, { status: 200 });

	} catch (err) {
		// Catch any unexpected errors and return 500
		return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
	}
}

// Update existing venue group
export async function PATCH(request, context) {
	const params = await context.params;
	const id = params.id;
	const groupId = Number(id);

	// Validate that ID is numeric
	if (isNaN(groupId)) {
		return NextResponse.json({ error: "Invalid group id" }, { status: 400 });
	}

	try {
		// Parse incoming JSON body
		const body = await request.json();
		const { name, venueIds } = body;  // venueIds is optional

		// Validate name if provided
		if (name !== undefined && typeof name !== "string") {
			return NextResponse.json({ error: "Invalid name" }, { status: 400 });
		}

		// Validate venueIds if provided
		if (venueIds !== undefined && !Array.isArray(venueIds)) {
			return NextResponse.json({ error: "venueIds must be an array" }, { status: 400 });
		}

		// Dynamically build the data to update based on provided fields
		const dataToUpdate = {};
		if (name) dataToUpdate.name = name;

		// If venueIds provided, update relations: disconnect all then connect new ones
		if (venueIds) {
			dataToUpdate.venues = {
				set: venueIds.map(id => ({ id })),  // Prisma relation update
			};
		}

		// Perform the update and include the updated venues in the response
		const updatedGroup = await prisma.venueGroup.update({
			where: { id: groupId },
			data: dataToUpdate,
			include: { venues: true },  // Return updated related venues
		});

		// Return updated group
		return NextResponse.json({ updatedGroup }, { status: 200 });

	} catch (err) {
		// Catch errors and return 500
		return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
	}
}

// Hard delete a venue group by ID
export async function DELETE(request, context) {
	const params = await context.params;
	const { id } = params;

	const groupId = Number(id);

	// Validate that ID is numeric
	if (isNaN(groupId)) {
		return NextResponse.json({ error: "Invalid org id" }, { status: 400 });
	}

	try {
		// Delete the venue group by ID
		const deletedGroup = await prisma.venueGroup.delete({
			where: { id: groupId },
		});

		// Return success response with deleted group info
		return NextResponse.json({ success: true, org: deletedGroup }, { status: 200 });

	} catch (err) {
		// If delete fails (e.g., invalid ID), return 500
		return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
	}
}
