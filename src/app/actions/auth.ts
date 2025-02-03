import NextAuth, { type DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import { findUserByEmail, addUser, type GoogleUser, type CredentialsUser, type ExtendedUser } from "./user"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null

        const { email, password } = credentials as {
          email: string
          password: string
        }

        const user = (await findUserByEmail(email)) as CredentialsUser

        if (user && user.login_method === "credentials") {
          const isMatch = await compare(password, user.password)

          if (isMatch) {
            return {
              id: user.id,
              email: user.email,
              isNewUser: false,
              login_method: user.login_method,
            }
          }
        }
        return null
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile): Promise<ExtendedUser> {
        const email = profile.email
        let user = (await findUserByEmail(email)) as GoogleUser
        let isNewUser = false
        if (!user) {
          user = await addUser(profile.name!, profile.email!, "google")
          isNewUser = true
        }

        return {
          id: user.id,
          email: user.email,
          login_method: "google",
          isNewUser,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // console.log("user in JWT: " + user);
        token.id = user.id
        token.email = user.email
        token.isNewUser = (user as ExtendedUser).isNewUser
        token.login_method = (user as ExtendedUser).login_method
      }
      // console.log("token after JWT callback: ", token);
      return token
    },
    async session({ session, token }): Promise<DefaultSession & { user: ExtendedUser }> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          isNewUser: token.isNewUser as boolean,
          login_method: token.login_method as string,
        },
      }
    },
  },
})

