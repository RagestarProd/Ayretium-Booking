import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';  // Next.js response helper
import { Prisma } from '@prisma/client'; // import Prisma error class

const token = process.env.CURRENT_API_TOKEN;
const subdomain = process.env.NEXT_PUBLIC_CURRENT_SUBDOMAIN;

export async function GET() {
	// Get all venues from local DB (including internal ID for deletion purposes)
	const dbVenues = await prisma.venue.findMany({
		select: { id: true, current_id: true, name: true },
	});

	// If no venues exist in DB, return an empty list early
	if (dbVenues.length === 0) {
		return NextResponse.json({ venues: [] }, { status: 200 });
	}

	// Build query string for Current RMS using current_id values
	const queryParams = dbVenues
		.map((v) => `q[id_in][]=${encodeURIComponent(v.current_id)}`)
		.join("&");

	const fullUrl = `https://api.current-rms.com/api/v1/members?filtermode=venue&${queryParams}`;

	try {
		// Fetch venues from Current RMS API
		const rmsRes = await fetch(fullUrl, {
			cache: "no-store", // Disable caching for up-to-date data
			headers: {
				"X-Auth-Token": token,
				Accept: "application/json",
				"X-SUBDOMAIN": subdomain,
			},
		});

		// If Current RMS call fails, throw an error
		if (!rmsRes.ok) {
			throw new Error(`Failed to fetch venues: ${rmsRes.status} ${rmsRes.statusText}`);
		}

		const data = await rmsRes.json();

		// Build a quick lookup map from RMS venue ID to RMS venue object
		const rmsVenuesById = new Map(
			(data.members || []).map((venue) => [venue.id.toString(), venue])
		);

		// Identify any DB venues that no longer exist in RMS and need to be deleted
		const toDelete = dbVenues.filter(
			(v) => !rmsVenuesById.has(v.current_id.toString())
		);

		// Delete obsolete venues from DB
		if (toDelete.length > 0) {
			try {
				const deleteIds = toDelete.map((v) => v.id);
				await prisma.venue.deleteMany({
					where: { id: { in: deleteIds } },
				});
			} catch (error) {
				if (error instanceof Prisma.PrismaClientKnownRequestError) {
					if (error.code === 'P2003') {
						// Foreign key constraint failed
						return NextResponse.json(
							{ error: 'Cannot delete venues: related records exist. Remove dependent records first.' },
							{ status: 409 } // Conflict
						);
					} else {
						// Other Prisma known errors
						return NextResponse.json(
							{ error: `Prisma error: ${error.message}` },
							{ status: 500 }
						);
					}
				} else {
					// Unknown or other errors
					return NextResponse.json(
						{ error: `Unexpected error: ${error.message || error}` },
						{ status: 500 }
					);
				}
			}
		}

		// For remaining venues, update names in DB to match RMS (if name exists)
		for (const v of dbVenues) {
			const rmsVenue = rmsVenuesById.get(v.current_id.toString());
			if (rmsVenue && rmsVenue.name) {
				await prisma.venue.update({
					where: { id: v.id },
					data: { name: rmsVenue.name },
				});
			}
		}

		// Build the final list of updated venues to return to client
		const updatedVenues = dbVenues
			.filter((v) => rmsVenuesById.has(v.current_id.toString()))
			.map(({ current_id }) => {
				const rmsVenue = rmsVenuesById.get(current_id.toString());
				return {
					id: current_id,
					name: rmsVenue ? rmsVenue.name : null,
				};
			});

		// Return success response with updated venues and number of deletions
		return NextResponse.json(
			{ venues: updatedVenues, deletedCount: toDelete.length },
			{ status: 200 }
		);

	} catch (error) {
		console.error("Error fetching venues from Current RMS:", error);

		// Return standardized 500 error response
		return NextResponse.json(
			{ error: error.message || 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
