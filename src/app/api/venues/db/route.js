// API - get all venues from DB

import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';  // Next.js Response helper

const token = process.env.CURRENT_API_TOKEN;
const subdomain = process.env.NEXT_PUBLIC_CURRENT_SUBDOMAIN;

export async function GET(req) {

	// Get all visible venues from DB
	// Using Promise.all to fetch both the list and the total count simultaneously
	const [dbVenues, total] = await Promise.all([
		prisma.venue.findMany({
			where: { visible: 1 },  // Only fetch venues marked as visible
			select: { 
				id: true, 
				current_id: true, 
				name: true, 
				venueGroupId: true 
			}  // Only select necessary fields for the frontend
		}),
		prisma.venue.count({
			where: { visible: 1 },  // Total count of visible venues
		}),
	]);

	try {
		// Return the venues as JSON using NextResponse
		// Only returning the data array as per your current needs
		return NextResponse.json(
			{
				data: dbVenues
			}, 
			{ status: 200 }
		);

	} catch (err) {
		// Catch any unexpected errors and return a 500 response
		return NextResponse.json(
			{ error: err.message || 'Internal Server Error' }, 
			{ status: 500 }
		);
	}
}
