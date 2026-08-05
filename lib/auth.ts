import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

type UserRole = "ADMIN" | "OPERATOR";

interface CredentialsUser {
  id: string;
  name: string;
  role: UserRole;
}

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      role?: UserRole | null;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  basePath: "/api/auth",
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<CredentialsUser | null> => {
        if (credentials.username === "admin" && credentials.password === "admin") {
          return { id: "1", name: "Administrator", role: "ADMIN" };
        }
        if (credentials.username === "user" && credentials.password === "user") {
          return { id: "2", name: "Operator", role: "OPERATOR" };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as CredentialsUser).role;
      }
      return token;
    },
    session({ session, token }) {
      if (token.role) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
