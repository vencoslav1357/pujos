import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_ORIGIN = "https://josefpufr.cz";
const DUPLICATE_HOST = "pujos.vercel.app";

/**
 * Produkční alias pujos.vercel.app vrací stejný web jako josefpufr.cz a
 * sám se nepřesměrovává. 301 jen pro tento hostitel — náhledy na jiných
 * *.vercel.app adresách zůstávají použitelné.
 */
export function proxy(request: NextRequest) {
  const hostname = (request.headers.get("host") ?? "")
    .split(":")[0]
    .toLowerCase();

  if (hostname !== DUPLICATE_HOST) {
    return NextResponse.next();
  }

  const destination = new URL(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    CANONICAL_ORIGIN,
  );
  return NextResponse.redirect(destination, 301);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
