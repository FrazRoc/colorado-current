import type { NextRequest } from "next/server";

// Proxies logo.dev's Logo API through our own domain, both to avoid exposing
// LOGO_DEV_TOKEN in client-visible network requests and to centralize
// caching/fallback behavior. (Previously proxied Clearbit's logo API, which
// browser tracking-protection lists blocked outright — moot now since that
// service shut down entirely on 2025-12-08. logo.dev is the vendor's own
// recommended replacement.)
export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain || !/^[a-z0-9.-]+$/i.test(domain)) {
    return new Response(null, { status: 400 });
  }

  const token = process.env.LOGO_DEV_TOKEN;
  if (!token) {
    return new Response(null, { status: 500 });
  }

  // fallback=404 so a company with no known logo returns a plain 404
  // instead of logo.dev's generic monogram placeholder — our own
  // CompanyLogo component already renders a styled initial-letter avatar
  // on image error, which fits the site's design better.
  const res = await fetch(
    `https://img.logo.dev/${domain}?token=${token}&size=128&format=png&fallback=404`,
    { next: { revalidate: 60 * 60 * 24 * 7 } }
  );

  if (!res.ok) {
    return new Response(null, { status: res.status });
  }

  const buffer = await res.arrayBuffer();
  return new Response(buffer, {
    headers: {
      "Content-Type": res.headers.get("content-type") || "image/png",
      "Cache-Control": "public, max-age=604800, immutable",
    },
  });
}
