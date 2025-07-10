import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server' // Import NextResponse

// Get all venue rooms from DB
export async function GET() {
	// Fetch all venue rooms, including their related venue data
	const venueRooms = await prisma.venueRoom.findMany({
		include: {
			venue: true,
		},
	});

	// Return venue rooms as JSON with appropriate content-type header
	return NextResponse.json(venueRooms, { status: 200 });
}

// Add new venue room to DB
export async function POST(req) {
	try {
		// Parse request body JSON
		const body = await req.json();
		const { name, venueID } = body;
		const venueIds = Number(venueID); // Convert venueID to Number for DB

		// Insert new venue room record into DB
		const newRoom = await prisma.venueRoom.create({
			data: {
				name: name,
				venueId: venueIds,
			},
		});

		// Return the newly created room in the response
		return NextResponse.json({ newRoom }, { status: 201 });
	} catch (err) {
		// On error, return JSON error message with 500 status code
		return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
	}
}
