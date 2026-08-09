import { jwtVerify, SignJWT } from "jose";

const MOBILE_ISSUER = "marginguard-mobile";
const MOBILE_AUDIENCE = "marginguard-ios";

function getSecret() {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is required for mobile authentication");
  return new TextEncoder().encode(secret);
}

export type MobileClaims = {
  sub: string;
  name: string;
  role: "ADMIN" | "OPERATOR";
};

export async function issueMobileToken(claims: MobileClaims) {
  return new SignJWT({ name: claims.name, role: claims.role })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(claims.sub)
    .setIssuer(MOBILE_ISSUER)
    .setAudience(MOBILE_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getSecret());
}

export async function requireMobileToken(request: Request): Promise<MobileClaims> {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("Missing bearer token");
  }

  const token = authorization.slice("Bearer ".length).trim();
  if (!token) throw new Error("Missing bearer token");

  const { payload } = await jwtVerify(token, getSecret(), {
    issuer: MOBILE_ISSUER,
    audience: MOBILE_AUDIENCE,
    algorithms: ["HS256"],
  });

  if (
    typeof payload.sub !== "string" ||
    (payload.role !== "ADMIN" && payload.role !== "OPERATOR") ||
    typeof payload.name !== "string"
  ) {
    throw new Error("Invalid mobile token claims");
  }

  return { sub: payload.sub, name: payload.name, role: payload.role };
}

export function unauthorizedResponse() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export function badRequestResponse(message: string) {
  return Response.json({ error: message }, { status: 400 });
}
