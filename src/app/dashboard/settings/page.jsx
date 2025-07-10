'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from "sonner";
import { Switch } from '@/components/ui/switch'
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select'

import {
	IconRefresh,
	IconLoader2,
	IconMail,
	IconGlobe,
	IconFlask,
} from '@tabler/icons-react'

export default function SettingsPage() {
	const [updating, setUpdating] = useState(false)
	const [testMode, setTestMode] = useState(false)
	const [timezone, setTimezone] = useState('Europe/London')
	const [contactEmail, setContactEmail] = useState('contact@example.com')

	const handleUpdate = async () => {
		setUpdating(true);
		try {
			const res = await fetch('/api/venues/import/update', { method: 'GET' });
			const result = await res.json();

			if (!res.ok) {
				// Show error toast with message from response or fallback
				toast.error(`Venues update failed: ${result.error || res.statusText}`);
			} else {
				toast.success("Venues updated successfully");
			}
		} catch (error) {
			toast.error("Venues update failed: " + error.message);
		} finally {
			setUpdating(false);
		}
	};

	return (
		<div className="max-w-3xl mx-auto mt-10 px-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-xl">Settings</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<table className="w-full text-sm">
						<tbody className="divide-y divide-muted">

							{/* Update Venue Names */}
							<tr className="py-4">
								<td className="pr-4 w-10">
									<IconRefresh size={20} className="text-muted-foreground" />
								</td>
								<td className="py-4 pt-0">
									<strong>Update Venues</strong>
									<p className="text-muted-foreground text-xs">
										Pull latest venue names and delete any venues that have been deleted in Current RMS.
									</p>
								</td>
								<td className="text-right">
									<Button onClick={handleUpdate} disabled={updating}>
										{updating && (
											<IconLoader2 className="animate-spin w-4 h-4 mr-2" />
										)}
										Update
									</Button>
								</td>
							</tr>

							{/* Test Mode */}
							<tr className="py-4">
								<td className="pr-4 w-10">
									<IconFlask size={20} className="text-muted-foreground" />
								</td>
								<td className="py-4">
									<strong>Enable Test Mode</strong>
									<p className="text-muted-foreground text-xs">
										Used for internal testing features
									</p>
								</td>
								<td className="text-right">
									<Switch checked={testMode} onCheckedChange={setTestMode} />
								</td>
							</tr>

							{/* Timezone */}
							<tr className="py-4">
								<td className="pr-4 w-10">
									<IconGlobe size={20} className="text-muted-foreground" />
								</td>
								<td className="py-4">
									<strong>Timezone</strong>
									<p className="text-muted-foreground text-xs">
										Used for scheduling events
									</p>
								</td>
								<td className="text-right">
									<Select value={timezone} onValueChange={setTimezone}>
										<SelectTrigger className="w-52">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Europe/London">Europe/London</SelectItem>
											<SelectItem value="UTC">UTC</SelectItem>
											<SelectItem value="America/New_York">
												America/New_York
											</SelectItem>
										</SelectContent>
									</Select>
								</td>
							</tr>

							{/* Contact Email */}
							<tr className="py-4">
								<td className="pr-4 w-10">
									<IconMail size={20} className="text-muted-foreground" />
								</td>
								<td className="py-4">
									<strong>Default Contact Email</strong>
									<p className="text-muted-foreground text-xs">
										Used for system notifications
									</p>
								</td>
								<td className="text-right">
									<Input
										type="email"
										className="w-64"
										value={contactEmail}
										onChange={(e) => setContactEmail(e.target.value)}
									/>
								</td>
							</tr>
						</tbody>
					</table>
				</CardContent>
			</Card>
		</div>
	)
}
