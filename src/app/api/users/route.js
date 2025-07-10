import prisma from '@/lib/prisma';
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function GET() {
	try {
		const users = await prisma.user.findMany({
			include: {
				venueGroup: true,  // Optional: include related data if needed
				venue: true,
			},
		});
		return NextResponse.json(users, { status: 200 });
	} catch (error) {
		console.error('GET /api/users failed:', error);
		return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
	}
}

export async function POST(request) {
	const body = await request.json();
	const { name, email, role, password, venueGroupId, venueId } = body;

	// Basic validation
	if (!name || !email || !role || !password) {
		return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
	}

	try {
		// Check for duplicate email
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return NextResponse.json({ error: "User already exists" }, { status: 400 });
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create user with optional venueGroupId and venueId
		const newUser = await prisma.user.create({
			data: {
				email,
				name,
				password: hashedPassword,
				role,
				venueGroupId: venueGroupId ? Number(venueGroupId) : null,
				venueId: venueId ? Number(venueId) : null,
			},
		});

		return NextResponse.json(newUser, { status: 201 });

	} catch (error) {
		console.error('POST /api/users failed:', error);
		return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
	}
}
