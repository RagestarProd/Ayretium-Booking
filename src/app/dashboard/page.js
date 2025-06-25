'use client'

import { useState } from 'react';
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar";


export default function DashboardPage() {
	const [selectedDate, setSelectedDate] = useState(null)
	const formatKey = (date) => format(date, "yyyy-MM-dd")

	const notes = {
		"2025-06-21": "3 bookings",
		"2025-06-22": "1 bookings",
		"2025-06-24": "2 bookings",
	}
	const bookingsd = {
		"2025-06-21": { count: 3, details: ["John (10am)", "Jane (1pm)", "Rob (3pm)"] },
		"2025-06-22": { count: 1, details: ["Alice (2pm)"] },
		"2025-06-23": { count: 2, details: ["Mark (9am)", "Lena (1pm)"] },
	}
	const bookingInfo = selectedDate
		? bookingsd[formatKey(selectedDate)] || { count: 0, details: [] }
		: null


	return (
		<div className="flex flex-wrap gap-5 p-5 items-start">

			{/* Calendar */}
			<div className="rounded-xl border xs:p-2 p-5 bg-card flex flex-grow flex-col min-w-[360px] lg:min-w-[640px] lg:max-w-[800px] m-auto mt-0">
				<h2 className="text-xl font-semibold mb-2">Booking Calendar</h2>
				<div className="mt-5 @container">
					<div className="p-0 flex flex-col @[640px]:flex-row">
						<Calendar
							mode="single"
							className="w-full p-0 bg-transparent"
							captionLayout="dropdown"
							selected={selectedDate}
							onSelect={setSelectedDate}
							components={{
								Day: ({ date, children, className, ...props }) => {
									const cleanClass = className
										.split(" ")
										.filter((c) => c !== "aspect-square")
										.join(" ")
									const finalClass = `${cleanClass} aspect-3/2 mr-1`
									return (
										<td className={finalClass} {...props}  >
											{children}
										</td>
									)
								},
								DayButton: ({ children, modifiers, day, ...dayProps }) => {
									const key = format(day.date, "yyyy-MM-dd")
									const label = notes[key]

									return (
										<button
											{...dayProps}
											className={`flex flex-col items-center justify-center w-full h-full rounded-md ${modifiers.selected
												? "bg-primary text-primary-foreground"
												: "hover:border"
												} ${modifiers.today
												? "bg-accent-foreground text-foreground"
												: "hover:border"
												}`}
										>
											<span className="text-xs @lg:text-sm">{children}</span>
											{label && (
												<span className={`text-[9px] @lg:text-[10px]  mt-0.5 px-1 leading-tight hidden @md:block whitespace-nowrap ${modifiers.selected
													? "primary-foreground"
													: "text-muted-foreground"
													}`}>
													{label}
												</span>
											)}
										</button>
									)
								},
								TableCell: ({ children, ...props }) => {
									<td
										className="bg-muted hover:bg-accent transition-colors duration-150 rounded-sm p-1 text-center">
										{children}
									</td>
								},
							}}
						/>
						<div className="p-5 bg-secondary text-primary-foreground shadow-xs mt-2 rounded-md @[640px]:w-[260px] @[640px]:ml-6 @[640px]:mt-0">
							{selectedDate
								? <h1>{format(selectedDate, "PPP")}</h1>
								: "Select a day to view bookings"}
							{selectedDate && bookingInfo.details.length > 0 ? (
								<ul className="list-disc ml-4 text-sm space-y-1">
									{bookingInfo.details.map((detail, i) => (
										<li key={i}>{detail}</li>
									))}
								</ul>
							) : selectedDate ? (
								<p className="text-sm">
									No bookings on this day.
								</p>
							) : (
								<p className="text-xs">
									Please select a day from the calendar.
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
