import prisma from '@/lib/prisma'
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function GET() {
	try {
		const users = await prisma.user.findMany()
		return new Response(JSON.stringify(users), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		})
	} catch (error) {
		return new Response(
			JSON.stringify({ error: 'Failed to fetch users' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		)
	}
}

export async function POST(request) {
		const body = await request.json()
		const { name, email, role, password } = body

		if (!name || !email || !role || !password) {
			return new Response(
				JSON.stringify({ error: 'Missing required fields' }),
				{ status: 400, headers: { 'Content-Type': 'application/json' } }
			)
		}

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({ where: { email } })
		if (existingUser) {
			return NextResponse.json({ error: "User already exists" }, { status: 400 })
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10)

	try {
		// Create user
		const newUser = await prisma.user.create({
			data: {
				email,
				name,
				password: hashedPassword,
				role
			},
		})

		return new Response(JSON.stringify(newUser), {
			status: 201,
			headers: { 'Content-Type': 'application/json' },
		})
	} catch (error) {
		return new Response(
			JSON.stringify({ error: 'Failed to create user' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		)
	}
}
