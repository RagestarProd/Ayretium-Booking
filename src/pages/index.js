import { useState } from 'react';
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardDescription } from "@/components/ui/card"
import { CardFooter } from "@/components/ui/card"
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog'
import { Tabs } from "@/components/ui/tabs"
import { TabsList } from "@/components/ui/tabs"
import { TabsTrigger } from "@/components/ui/tabs"
import { TabsContent } from "@/components/ui/tabs"
import { Tooltip } from "@/components/ui/tooltip"
import { TooltipContent } from "@/components/ui/tooltip"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup } from "@/components/ui/radio-group"
import { RadioGroupItem } from "@/components/ui/radio-group"
import { Select } from "@/components/ui/select"
import { SelectContent } from "@/components/ui/select"
import { SelectItem } from "@/components/ui/select"
import { SelectTrigger } from "@/components/ui/select"
import { SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"

export default function UIShowcase() {
	const [selectedDate, setSelectedDate] = useState(null)
	const formatKey = (date) => format(date, "yyyy-MM-dd")
	const [inputValue, setInputValue] = useState("")
	const [textareaValue, setTextareaValue] = useState("")
	const [checkboxValue, setCheckboxValue] = useState(false)
	const [radioValue, setRadioValue] = useState("option1")
	const [selectValue, setSelectValue] = useState("")
	const [switchValue, setSwitchValue] = useState(false)
	const [sliderValue, setSliderValue] = useState(50)
	const [pressedVariant, setPressedVariant] = useState('')


	const handleSubmit = (e) => {
		e.preventDefault()
		toast.success("Form submitted!")
	}

	const notes = {
		"2025-06-21": "3 bookings",
		"2025-06-22": "1 bookings",
		"2025-06-24": "2 bookings",
	}
	const bookings = {
		"2025-06-21": { count: 3, details: ["John (10am)", "Jane (1pm)", "Rob (3pm)"] },
		"2025-06-22": { count: 1, details: ["Alice (2pm)"] },
		"2025-06-23": { count: 2, details: ["Mark (9am)", "Lena (1pm)"] },
	}
	const bookingInfo = selectedDate
		? bookings[formatKey(selectedDate)] || { count: 0, details: [] }
		: null



	const variants = [
		'default',
		'secondary',
		'destructive',
		'outline',
		'ghost',
		'link',
	]

	return (
		<div>
			<div className="flex flex-wrap gap-5 p-5 items-start">

				{/* Calendar */}
				<div className="rounded-xl border xs:p-2 p-5 bg-card flex flex-grow flex-col min-w-[360px] lg:min-w-[640px] m-auto mt-0">
					<h2 className="text-xl font-semibold mb-2">Booking Calendar</h2>
					<div className="@container">
						<div className="p-0 flex flex-col @[640px]:flex-row">
							<Calendar
								mode="single"
								className="w-full p-0"
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
													? "bg-foreground text-white"
													: "hover:bg-accent"
													}`}
											>
												<span className="text-xs @lg:text-sm">{children}</span>
												{label && (
													<span className="text-[9px] @lg:text-[10px] text-muted-foreground mt-0.5 px-1 leading-tight hidden @md:block whitespace-nowrap">
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
							<div className="p-5 bg-secondary text-primary shadow-xs mt-2 rounded-md @[640px]:w-[260px] @[640px]:ml-2  @[640px]:mt-0">
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

				{/* Form */}
				<div className="rounded-xl border p-5 bg-card flex-1 flex-1 max-w-[550px] md:min-w-[400px] m-auto  mt-0">
					<h2 className="text-xl font-semibold mb-2">Form Input</h2>
					<form
						onSubmit={handleSubmit}
						className="max-w-lg mx-auto space-y-6"
					>
						{/* Text Input */}
						<div>
							<label htmlFor="input" className="block mb-1 font-medium">
								Text Input
							</label>
							<Input
								id="input"
								type="text"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								placeholder="Type something..."
							/>
						</div>

						{/* Textarea */}
						<div>
							<label htmlFor="textarea" className="block mb-1 font-medium">
								Textarea
							</label>
							<Textarea
								id="textarea"
								value={textareaValue}
								onChange={(e) => setTextareaValue(e.target.value)}
								placeholder="Write more here..."
								rows={4}
							/>
						</div>

						{/* Checkbox */}
						<div className="flex items-center space-x-2">
							<Checkbox
								id="checkbox"
								checked={checkboxValue}
								onCheckedChange={(checked) => setCheckboxValue(checked === true)}
							/>
							<label htmlFor="checkbox" className="select-none">
								Accept Terms & Conditions
							</label>
						</div>

						{/* Radio Group */}
						<div>
							<p className="mb-1 font-medium">Choose an option</p>
							<RadioGroup
								value={radioValue}
								onValueChange={setRadioValue}
								className="flex space-x-4"
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="option1" id="r1" />
									<label htmlFor="r1">Option 1</label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="option2" id="r2" />
									<label htmlFor="r2">Option 2</label>
								</div>
							</RadioGroup>
						</div>

						{/* Select */}
						<div>
							<label htmlFor="select" className="block mb-1 font-medium">
								Select a fruit
							</label>
							<Select value={selectValue} onValueChange={setSelectValue}>
								<SelectTrigger id="select" className="w-full">
									<SelectValue placeholder="Choose a fruit" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="apple">Apple</SelectItem>
									<SelectItem value="banana">Banana</SelectItem>
									<SelectItem value="orange">Orange</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Switch */}
						<div className="flex items-center space-x-2">
							<Switch
								id="switch"
								checked={switchValue}
								onCheckedChange={setSwitchValue}
							/>
							<label htmlFor="switch" className="select-none">
								Enable notifications
							</label>
						</div>

						{/* Slider */}
						<div>
							<label htmlFor="slider" className="block mb-1 font-medium">
								Volume: {sliderValue}
							</label>
							<Slider
								id="slider"
								value={[sliderValue]}
								onValueChange={(val) => setSliderValue(val[0])}
								max={100}
								step={1}
								className="w-full"
							>
							</Slider>
						</div>


						{/* Submit Button */}
						<Button type="submit">Submit</Button>
					</form>
				</div>



				{/* Interface */}
				<div className="no-border p-2 md:p-5 lg:p-8 bg-card inset-shadow-sm rounded-lg flex-1 min-w-[280px] m-auto  mt-0">
					<h2 className="text-xl font-semibold mb-2">Interactive UI</h2>

					<Tabs defaultValue="account">
						<TabsList>
							<TabsTrigger value="account">Cards</TabsTrigger>
							<TabsTrigger value="password">Buttons</TabsTrigger>
							<TabsTrigger value="notifications">Notifications</TabsTrigger>
						</TabsList>
						<TabsContent value="account" className="gap-4">
							<Card className="w-full max-w-md mb-3">
								<CardHeader>
									<CardTitle>Card Title</CardTitle>
									<CardDescription>Card description goes here</CardDescription>
								</CardHeader>
								<CardContent>
									<p>This is the main content of the card.</p>
									<ul className="mt-2 list-disc list-inside text-sm text-muted-foreground">
										<li>Supports lists</li>
										<li>Custom text styles</li>
										<li>Form elements, grids, etc.</li>
									</ul>
								</CardContent>
								<CardFooter className="flex justify-end gap-2">
									<Button variant="default">Default</Button>
								</CardFooter>
							</Card>
							<Card className="w-full max-w-sm">
								<CardHeader>
									<CardTitle>Product Title</CardTitle>
									<CardDescription>$49.99 • In stock</CardDescription>
								</CardHeader>
								<CardContent>
									<img src="/avatars/admin.jpg" alt="Product" className="w-full rounded mb-4" />
									<p className="text-sm text-muted-foreground">Short description or summary of the product.</p>
								</CardContent>
								<CardFooter className="justify-between">
									<Button variant="ghost">Details</Button>
									<Button>Add to Cart</Button>
								</CardFooter>
							</Card>
						</TabsContent>
						<TabsContent value="password">
							{variants.map((variant) => (
								<Dialog key={variant}>
									<DialogTrigger asChild>
										<Button
											variant={variant}
											className="m-4"
											onClick={() => setPressedVariant(variant)}
										>
											{variant.charAt(0).toUpperCase() + variant.slice(1)}
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Button Pressed</DialogTitle>
											<DialogDescription>
												You clicked the <strong>{variant}</strong> button variant.
											</DialogDescription>
										</DialogHeader>
									</DialogContent>
								</Dialog>
							))}
						</TabsContent>
						<TabsContent value="notifications">
							<Button
								variant="outline"
								onClick={() =>
									toast("Event has been created", {
										description: "Sunday, December 03, 2023 at 9:00 AM",
										action: {
											label: "Undo",
											onClick: () => console.log("Undo"),
										},
									})
								}
							>
								Generate Notification
							</Button>
						</TabsContent>
					</Tabs>


				</div>

			</div>
		</div>
	)
}
