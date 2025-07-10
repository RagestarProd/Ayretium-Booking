import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'  // Import NextResponse

// Get a venue room by ID
export async function GET(request, context) {
	const params = await context.params
	const { id } = params

	const roomId = Number(id)
	if (isNaN(roomId)) {
		// Validate room ID is a number
		return NextResponse.json({ error: "Invalid room id" }, { status: 400 })
	}

	try {
		// Find the venue room by ID including related venue info
		const venueRoom = await prisma.venueRoom.findUnique({
			where: { id: roomId },
			include: { venue: true },
		})

		if (!venueRoom) {
			return NextResponse.json({ error: "Venue room not found" }, { status: 404 })
		}

		// Return the found venue room data as JSON
		return NextResponse.json(venueRoom, { status: 200 })
	} catch (err) {
		// Return server error JSON on exception
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}

// Update an existing venue room by ID
export async function PATCH(request, context) {
	const params = await context.params
	const { id } = params

	const roomId = Number(id)
	if (isNaN(roomId)) {
		return NextResponse.json({ error: "Invalid room id" }, { status: 400 })
	}

	try {
		const body = await request.json()
		const { name, venueID } = body
		const venueIdNum = Number(venueID)

		// Validate required fields
		if (!name || isNaN(venueIdNum)) {
			return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 })
		}

		// Update venue room record in DB with new data
		const updatedRoom = await prisma.venueRoom.update({
			where: { id: roomId },
			data: {
				name,
				venueId: venueIdNum,
			},
			include: { venue: true },
		})

		// Return updated venue room data
		return NextResponse.json({ updatedRoom }, { status: 200 })
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}

// Create a new venue room
export async function POST(request) {
	try {
		const body = await request.json()
		const { name, venueID } = body
		const venueIdNum = Number(venueID)

		// Validate required fields
		if (!name || isNaN(venueIdNum)) {
			return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 })
		}

		// Create new venue room record
		const newRoom = await prisma.venueRoom.create({
			data: {
				name,
				venueId: venueIdNum,
			},
			include: { venue: true },
		})

		// Return newly created room data
		return NextResponse.json({ newRoom }, { status: 201 })
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}

// Hard delete a venue room by ID
export async function DELETE(request, context) {
	const params = await context.params
	const { id } = params

	const roomId = Number(id)
	if (isNaN(roomId)) {
		return NextResponse.json({ error: "Invalid room id" }, { status: 400 })
	}

	try {
		// Delete venue room by ID
		const deletedRoom = await prisma.venueRoom.delete({
			where: { id: roomId },
		})

		// Return success message and deleted room data
		return NextResponse.json({ success: true, room: deletedRoom }, { status: 200 })
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}
