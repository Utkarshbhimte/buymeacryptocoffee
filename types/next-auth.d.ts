import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    email: string,
    name: string,
    image: string
  }
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User,
    expired: Date
  }
}