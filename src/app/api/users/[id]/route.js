import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

/**
 * API route for /api/users/:id
 * Supports GET (fetch), PUT (update), DELETE (delete)
 * 
 * I make sure to destructure params correctly from context,
 * validate inputs, hash passwords securely,
 * and handle errors gracefully with proper status codes.
 */

// GET /api/users/:id → Fetch a single user by ID
export async function GET(request, { params }) {
	const { id } = params;

	// Guard: user ID is required
	if (!id) {
		return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
	}

	try {
		// Fetch user including related venueGroup and venue
		const user = await prisma.user.findUnique({
			where: { id },
			include: {
				venueGroup: true,
				venue: true,
			},
		});

		if (!user) {
			// User not found
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		// Return user data
		return NextResponse.json({ data: user }, { status: 200 });
	} catch (error) {
		console.error(`GET /api/users/${id} failed:`, error);
		return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
	}
}

// PUT /api/users/:id → Update user info
export async function PUT(request, { params }) {
	const { id } = params;
	const body = await request.json();
	const { name, email, role, password, venueGroupId, venueId } = body;

	// Basic validation of required fields
	if (!name || !email || !role) {
		return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
	}

	try {
		// Prepare data to update
		const updateData = {
			name,
			email,
			role,
			venueGroupId: venueGroupId ? Number(venueGroupId) : null,
			venueId: venueId ? Number(venueId) : null,
		};

		// Hash password only if provided and not empty
		if (password && password.trim() !== '') {
			updateData.password = await bcrypt.hash(password, 10);
		}

		// Update user in DB
		const updatedUser = await prisma.user.update({
			where: { id },
			data: updateData,
		});

		return NextResponse.json({ data: updatedUser }, { status: 200 });
	} catch (error) {
		console.error(`PUT /api/users/${id} failed:`, error);
		return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
	}
}

// DELETE /api/users/:id → Delete a user by ID
export async function DELETE(request, { params }) {
	const { id } = params;

	// Guard: user ID required
	if (!id) {
		return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
	}

	try {
		// Delete user from DB
		await prisma.user.delete({
			where: { id },
		});

		// Return success response with no content
		return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
	} catch (error) {
		console.error(`DELETE /api/users/${id} failed:`, error);

		// If user not found, respond accordingly
		if (error.code === 'P2025') { // Prisma not found error code
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
	}
}
