import { auth } from "@/auth";

const rutasProtegidas = ["/dashboard", "/administrador"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = rutasProtegidas.some((r) => pathname.startsWith(r));
  const isLoggedIn = !!req.auth;

  if (isProtected && !isLoggedIn) {
    const signIn = new URL("/sign-in", req.url);
    signIn.searchParams.set("callbackUrl", pathname);
    return Response.redirect(signIn);
  }
  return undefined;
});

export const config = {
  matcher: ["/dashboard/:path*", "/administrador/:path*"],
};
