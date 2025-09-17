import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface User {
        id: string
        name: string
        email: string
        image: string
        role: string
        provider: string
    }
    interface Session {
        user: {
            id: string
            name: string
            email: string
            image: string
            role: string
        } & DefaultSession["user"]
    }
}
