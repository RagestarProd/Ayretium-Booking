// app/booking/page.jsx
import React from "react"

// Mock fetch function — replace with your real data fetching logic (DB, API, etc)
async function fetchBookings() {
	// Example data structure
	return [
		{ id: 1, customer: "Alice Smith", date: "2025-07-01", status: "Confirmed" },
		{ id: 2, customer: "Bob Johnson", date: "2025-07-03", status: "Pending" },
		{ id: 3, customer: "Charlie Davis", date: "2025-07-05", status: "Cancelled" },
	]
}

export default async function BookingPage() {
	const bookings = await fetchBookings()

	return (
		<div className="space-y-4 max-w-xl p-4">
			{bookings.length === 0 ? (
				<p>No bookings found.</p>
			) : (
				<table className="w-full border border-gray-300">
					<thead>
						<tr>
							<th className="border border-gray-300 px-4 py-2 text-left">Customer</th>
							<th className="border border-gray-300 px-4 py-2 text-left">Date</th>
							<th className="border border-gray-300 px-4 py-2 text-left">Status</th>
						</tr>
					</thead>
					<tbody>
						{bookings.map(({ id, customer, date, status }) => (
							<tr key={id} className="hover:bg-gray-100">
								<td className="border border-gray-300 px-4 py-2">{customer}</td>
								<td className="border border-gray-300 px-4 py-2">{date}</td>
								<td className="border border-gray-300 px-4 py-2">{status}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	)
}
