import { NextResponse } from "next/server"

export async function middleware(req: any) {
  const { geo } = req
  const country = geo?.country?.toLowerCase() || "us"
  const res = NextResponse.next()

  res.cookies.set("country", country, {
    path: "/", // Set the cookie for the entire domain
    sameSite: "none", // Allow cross-origin requests
    secure: true, // Require secure connection (HTTPS)
  })
  const requestHeaders = new Headers(req.headers)

  requestHeaders.set("country", country)

  // return res

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}
