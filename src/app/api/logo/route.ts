import type { NextRequest } from "next/server";

// Proxies Clearbit's logo API through our own domain. Browser
// tracking-protection lists (Firefox ETP, uBlock Origin, Brave) block
// logo.clearbit.com outright since Clearbit is primarily known as a
// data-enrichment/tracking company, which silently kills the logo for a lot
// of privacy-conscious visitors if fetched client-side. Routing through our
// own domain avoids that entirely, since the browser only ever sees a
// same-origin request.
export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain || !/^[a-z0-9.-]+$/i.test(domain)) {
    return new Response(null, { status: 400 });
  }

  const res = await fetch(`https://logo.clearbit.com/${domain}`, {
    next: { revalidate: 60 * 60 * 24 * 7 },
  });

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
