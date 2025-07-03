import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "/src/app/api/auth/[...nextauth]/route"
import prisma from '@/lib/prisma'

export async function PUT(req, context) {
	const params = await context.params;
	const id = Number(params.id);
	const body = await req.json();
	const { visibilityStatus, name } = body;  // <-- include name

	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user || !session.user.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const venue = await prisma.venue.upsert({
			where: { current_id: id },
			update: {
				visible: visibilityStatus,
				name,             // <-- update name
			},
			create: {
				current_id: id,
				visible: visibilityStatus,
				name,             // <-- create name
			},
		});

		return NextResponse.json(venue, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
