import { withAuth } from "next-auth/middleware";

export default withAuth({
	pages: {
		signIn: '/login', // redirect to your login page if not authenticated
	},
});

export const config = {
	matcher: [
		/*
		  Protect all routes under /dashboard and /api/venues
		  Adjust to your app routes needing protection
		*/
		'/dashboard/:path*',
		'/api/venues/:path*',
	],
};