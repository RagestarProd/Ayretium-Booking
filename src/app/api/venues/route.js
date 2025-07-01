export async function GET(req) {
	const token = process.env.CURRENT_API_TOKEN
	const subdomain = process.env.NEXT_PUBLIC_CURRENT_SUBDOMAIN
	const { searchParams } = new URL(req.url)
	const page = searchParams.get('page') || 1
	const perPage = searchParams.get('per_page') || 20
	const dbids = searchParams.get('dbids') || '[]'
	const getIDs = JSON.parse(dbids);
	const queryParams = getIDs.map(id => `q[id_in][]=${encodeURIComponent(id)}`).join('&')


	const fullUrl = `https://api.current-rms.com/api/v1/members?filtermode=venue&page=${page}&per_page=${perPage}&${queryParams}`

	console.log(fullUrl)
	try {
		const res = await fetch(fullUrl, {
			cache: 'no-store',
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
