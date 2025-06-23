import { useEffect, useState } from 'react';
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { DialogContent } from "@/components/ui/dialog"
import { DialogTrigger } from "@/components/ui/dialog"
import { Tabs } from "@/components/ui/tabs"
import { TabsList } from "@/components/ui/tabs"
import { TabsTrigger } from "@/components/ui/tabs"
import { TabsContent } from "@/components/ui/tabs"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenuContent } from "@/components/ui/dropdown-menu"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Tooltip } from "@/components/ui/tooltip"
import { TooltipContent } from "@/components/ui/tooltip"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";

export default function UIShowcase() {

	const handleClickCal = async (datain) => {
		setMessage(JSON.stringify(datain));
	};

	const bookings = {
		"2025-06-21": { count: 3, details: ["John (10am)", "Jane (1pm)", "Rob (3pm)"] },
		"2025-06-22": { count: 1, details: ["Alice (2pm)"] },
		"2025-06-23": { count: 2, details: ["Mark (9am)", "Lena (1pm)"] },
	}

	const [message, setMessage] = useState('');


	const [selectedDate, setSelectedDate] = useState(null)

	const formatKey = (date) => format(date, "yyyy-MM-dd")
	const bookingInfo = selectedDate
		? bookings[formatKey(selectedDate)] || { count: 0, details: [] }
		: null



	return (
		<div className="p-8 space-y-8">
			<h1 className="text-3xl font-bold">Ayretium Element Showcase</h1>
			<p>Review visual language of all design and page elements</p>




			<div>
				<h2 className="text-xl font-semibold mb-2">Booking Calendar</h2>

				<Calendar
					mode="single"
					className="rounded-xl border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
					captionLayout="dropdown"
					selected={selectedDate}
					onSelect={setSelectedDate}
					renderDay={(date) => {
						const key = formatKey(date)
						const day = date.getDate()
						const count = bookings[key]?.count || 0
						return (
							<div className="text-center">
								<div>{day}</div>
								{count > 0 && (
									<div className="text-xs text-muted-foreground">
										{count} booking{count > 1 ? "s" : ""}
									</div>
								)}
							</div>
						)
					}}

				/>

				<Card>
					<CardHeader>
						<CardTitle>
							{selectedDate
								? format(selectedDate, "PPP")
								: "Select a day to view bookings"}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{selectedDate && bookingInfo.details.length > 0 ? (
							<ul className="list-disc ml-4 text-sm space-y-1">
								{bookingInfo.details.map((detail, i) => (
									<li key={i}>{detail}</li>
								))}
							</ul>
						) : selectedDate ? (
							<p className="text-sm text-muted-foreground">
								No bookings on this day.
							</p>
						) : (
							<p className="text-sm text-muted-foreground">
								Please select a day from the calendar.
							</p>
						)}
					</CardContent>
				</Card>
			</div>


			{/* Button */}
			<div>
				<h2 className="text-xl font-semibold mb-2">Button</h2>
				<Button onClick={() => toast({ title: "Button Clicked!" })}>Click Me</Button>
			</div>

			{/* Input */}
			<div>
				<h2 className="text-xl font-semibold mb-2">Input</h2>
				<Input placeholder="Type here..." />
			</div>

			{/* Textarea */}
			<div>
				<h2 className="text-xl font-semibold mb-2">Textarea</h2>
				<Textarea placeholder="Write something..." />
			</div>

			{/* Card */}
			<div>
				<h2 className="text-xl font-semibold mb-2">Card</h2>
				<Card>
					<CardHeader>
						<CardTitle>Card Title</CardTitle>
					</CardHeader>
					<CardContent>This is the content of the card.</CardContent>
				</Card>
			</div>

			{/* Dialog */}
			<div>
				<h2 className="text-xl font-semibold mb-2">Dialog (Modal)</h2>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline">Open Dialog</Button>
					</DialogTrigger>
					<DialogContent>
						<p>This is a dialog box.</p>
					</DialogContent>
				</Dialog>
			</div>

			{/* Tabs */}
			<div>
				<h2 className="text-xl font-semibold mb-2">Tabs</h2>
				<Tabs defaultValue="account">
					<TabsList>
						<TabsTrigger value="account">Account</TabsTrigger>
						<TabsTrigger value="password">Password</TabsTrigger>
					</TabsList>
					<TabsContent value="account">Account content</TabsContent>
					<TabsContent value="password">Password content</TabsContent>
				</Tabs>
			</div>

			{/* Dropdown Menu */}
			<div>
				<h2 className="text-xl font-semibold mb-2">Dropdown Menu</h2>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button>Open Menu</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>Profile</DropdownMenuItem>
						<DropdownMenuItem>Settings</DropdownMenuItem>
						<DropdownMenuItem>Logout</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Tooltip */}
			<div>
				<h2 className="text-xl font-semibold mb-2">Tooltip</h2>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost">Hover Me</Button>
					</TooltipTrigger>
					<TooltipContent>This is a tooltip!</TooltipContent>
				</Tooltip>
			</div>

			{/* Switch */}
			<div>
				<h2 className="text-xl font-semibold mb-2">Switch</h2>
				<Switch />
			</div>
		</div>
	)
}
