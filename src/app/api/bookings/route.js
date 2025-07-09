import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "/src/app/api/auth/[...nextauth]/route"
import prisma from '@/lib/prisma'

export async function POST(req) {


	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user || !session.user.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const { date, time, description } = body;

		if (!date || !time) {
			return NextResponse.json(
				{ error: "Date and time are required" },
				{ status: 400 }
			);
		}

		const booking = await prisma.booking.create({
			data: {
				userId: session.user.id, 
				date: new Date(date),
				time,
				description: description || "",
			},
		});

		return NextResponse.json(booking, { status: 201 });
	} catch (error) {
		console.error("Booking creation error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
