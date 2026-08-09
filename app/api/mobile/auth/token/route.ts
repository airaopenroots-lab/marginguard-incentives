import { issueMobileToken } from "@/lib/mobile-auth";

const credentials: Record<string, { password: string; name: string; role: "ADMIN" | "OPERATOR" }> = {
  admin: { password: "admin", name: "Administrator", role: "ADMIN" },
  user: { password: "user", name: "Operator", role: "OPERATOR" },
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Username and password are required" }, { status: 400 });
  }

  const { username, password } = body as { username?: unknown; password?: unknown };
  const account = typeof username === "string" ? credentials[username] : undefined;
  if (!account || password !== account.password) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await issueMobileToken({ sub: username as string, name: account.name, role: account.role });
  return Response.json({ token, expiresIn: 43200, user: { name: account.name, role: account.role } });
}
