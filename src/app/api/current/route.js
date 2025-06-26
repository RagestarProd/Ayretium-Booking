export async function GET(req) {
	const subdomain = process.env.NEXT_PUBLIC_CURRENT_SUBDOMAIN
	const token = process.env.CURRENT_API_TOKEN

	const { searchParams } = new URL(req.url)
	const baseUrl = `https://api.current-rms.com/api/v1/opportunities`

	// Reconstruct query parameters, including `include[]` and `q[...]`
	const query = []
	for (const [key, value] of searchParams.entries()) {
		// Encode special brackets in keys like q[...] and include[]
		const encodedKey = key.replace(/\[/g, '%5B').replace(/\]/g, '%5D')
		query.push(`${encodedKey}=${encodeURIComponent(value)}`)
	}

	const fullUrl = `${baseUrl}?${query.join('&')}`
	
	console.log(fullUrl)

	try {
		const res = await fetch(fullUrl, {
			headers: {
				'X-Auth-Token': token,
				'Accept': 'application/json',
				'X-SUBDOMAIN' : subdomain
			}
		})

		const data = await res.json()

		if (!res.ok) {
			return new Response(JSON.stringify({ error: data }), { status: res.status })
		}

		return new Response(JSON.stringify(data), {
			headers: { 'Content-Type': 'application/json' }
		})

	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), { status: 500 })
	}
}
