import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "/src/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PUT(req, context) {
	const params = await context.params;  // await params
	const id = Number(params.id);
	const body = await req.json();
	const {visibilityStatus} = body;

	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user || !session.user.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const venue = await prisma.venue.upsert({
			where: { current_id: id },
			update: { visible: visibilityStatus },
			create: {
				current_id: id,
				visible: visibilityStatus,
			},
		});
		return NextResponse.json(venue, { status: 201 });

	} catch (error) {
		console.error("Error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
