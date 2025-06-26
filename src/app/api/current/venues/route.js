export async function GET(req) {
	const token = process.env.CURRENT_API_TOKEN
	const subdomain = process.env.NEXT_PUBLIC_CURRENT_SUBDOMAIN

	const fullUrl = `https://api.current-rms.com/api/v1/members?filtermode=venue`

	try{
		const res = await fetch(fullUrl, {
			headers: {
				'X-Auth-Token': token,
				'Accept': 'application/json',
				'X-SUBDOMAIN': subdomain
			}
		})

		const data = await res.json()

		if (!res.ok) {
			return new Response(JSON.stringify({ error: data }), { status: res.status })
		}

		return new Response(JSON.stringify(data), {
			headers: { 'Content-Type': 'application/json' },
		})

	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), { status: 500 })
	}
}
