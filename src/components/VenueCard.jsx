import React from 'react'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

export default function VenueCard({ member }) {
	const address = member.primary_address
	const mapsQuery = address
		? encodeURIComponent(
			`${address.street}, ${address.city} ${address.postcode}, ${address.country_name}`
		)
		: ''

	return (
		<Card className="max-w-md mx-auto">
			<CardHeader className="flex flex-col space-y-1">
				<div className="flex items-center justify-between">
					<CardTitle>{member.name}</CardTitle>
					<Badge variant={member.active ? 'outline' : 'secondary'}>
						{member.active ? 'Active' : 'Inactive'}
					</Badge>
				</div>
				<CardDescription>{member.membership_type}</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4 text-sm">
				{/* Bookable */}
				<div className="flex items-center justify-between">
					<span className="font-medium">Bookable</span>
					<Switch checked={member.bookable} disabled />
				</div>

				<Separator />

				{/* Address */}
				<div>
					<h4 className="font-semibold">Primary Address</h4>
					{address ? (
						<>
							<address className="not-italic text-muted-foreground">
								{address.street}
								<br />
								{address.city} {address.postcode}
								<br />
								{address.country_name}
							</address>
							<Button
								asChild
								className="mt-2"
								variant="link"
							>
								<a
									href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									View on Google Maps <ExternalLink className="w-4 h-4 ml-1" />
								</a>
							</Button>
						</>
					) : (
						<p>No address available.</p>
					)}
				</div>

				<Separator />

				{/* Emails */}
				<div>
					<h4 className="font-semibold">Emails</h4>
					{member.emails?.length ? (
						<ul className="space-y-1 text-muted-foreground">
							{member.emails.map((email) => (
								<li key={email.id}>
									<span className="font-medium">{email.email_type_name}: </span>
									<a href={`mailto:${email.address}`} className="underline">
										{email.address}
									</a>
								</li>
							))}
						</ul>
					) : (
						<p>No emails available.</p>
					)}
				</div>

				{/* Phones */}
				<div>
					<h4 className="font-semibold mt-4">Phones</h4>
					{member.phones?.length ? (
						<ul className="space-y-1 text-muted-foreground">
							{member.phones.map((phone) => (
								<li key={phone.id}>
									<span className="font-medium">{phone.phone_type_name}: </span>
									<a href={`tel:${phone.number}`} className="underline">
										{phone.number}
									</a>
								</li>
							))}
						</ul>
					) : (
						<p>No phone numbers available.</p>
					)}
				</div>

				{/* Links */}
				<div>
					<h4 className="font-semibold mt-4">Links</h4>
					{member.links?.length ? (
						<ul className="space-y-1 text-muted-foreground">
							{member.links.map((link) => (
								<li key={link.id}>
									<span className="font-medium">{link.link_type_name}: </span>
									<a
										href={link.address.startsWith('http') ? link.address : `https://${link.address}`}
										target="_blank"
										rel="noopener noreferrer"
										className="underline"
									>
										{link.address}
									</a>
								</li>
							))}
						</ul>
					) : (
						<p>No links available.</p>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
