import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';  // Next.js Response helper

// Get all venue groups from DB
export async function GET() {
	try {
		// Fetch all venue groups along with their associated venues
		const venueGroups = await prisma.venueGroup.findMany({
			include: {
				venues: true,  // Include the related venues for each group
			},
		});

		// Return the venue groups as JSON using NextResponse
		return NextResponse.json(venueGroups, { status: 200 });

	} catch (err) {
		// If something goes wrong, return a 500 error with the message
		return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
	}
}

// Add new venue group to DB
export async function POST(req) {
	try {
		// Parse the incoming JSON body
		const body = await req.json();
		const { name, venueIds } = body;

		// Create the new venue group in the database
		const newGroup = await prisma.venueGroup.create({
			data: { name },
		});

		// Update all selected venues to belong to this new venue group
		await prisma.venue.updateMany({
			where: {
				id: { in: venueIds },  // Only venues whose IDs are in this list will be updated
			},
			data: {
				venueGroupId: newGroup.id,  // Set the new venue group ID
			},
		});

		// Return the newly created group as JSON using NextResponse
		return NextResponse.json({ newGroup }, { status: 201 });

	} catch (err) {
		// Return a 500 error with the message if anything fails
		return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
	}
}
