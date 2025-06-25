// app/layout.js
import '../styles/globals.css'
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route"
import { SessionWrapper } from "@/components/SessionWrapper";
import { Toaster } from "sonner";

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <SessionWrapper session={session}>
          {children}
          <Toaster position="bottom-center" closeButton />
        </SessionWrapper>
      </body>
    </html>
  );
}
