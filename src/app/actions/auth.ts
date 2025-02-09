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
        username: { label: "Username", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null

        console.log(credentials);

        const { username, email, password } = credentials as {
          username?: string
          email: string
          password: string
        }

        if (!username) {
          const user = (await findUserByEmail(email)) as CredentialsUser

          if (user && user.login_method === "credentials") {
            const isMatch = await compare(password, user.password)

            if (isMatch) {
              return {
                userid: user.id,
                email: user.email,
                isNewUser: false,
                login_method: user.login_method,
              }
            }
          }
        }

        if (username) {
          try {
            const response = await fetch(`${process.env.BASE_URL}/api/auth/signup`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username, email, password, login_method: "credentials" }),
            })
      
            const data = await response.json()
      
            if (!response.ok) {
              throw new Error(data.error || 'Something went wrong')
            }
            // console.log("user id: ", data.user.userid)
            return {
              userid: data.user.userid,
              email: data.user.email,
              isNewUser: true,
              login_method: data.user.login_method,
            }
          } catch (error) {
            console.error("Signup error: ", error)
            return null;
          }
        }

        return null
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // async profile(profile): Promise<GoogleUser> {
        async profile(profile) {
        const email = profile.email
        let user = (await findUserByEmail(email)) as GoogleUser
        let isNewUser = false
        if (!user) {
          user = await addUser(profile.name!, profile.email!, "google")
          isNewUser = true
        }
        console.log("added user id: ", user.id);

        return {
          userid: user.id,
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
        //  console.log("user in jwt callback: ", user)
        token.id = (user as ExtendedUser).userid
        token.email = user.email
        token.isNewUser = (user as ExtendedUser).isNewUser
        token.login_method = (user as ExtendedUser).login_method
      }
      // console.log("token after jwt callback: ", token);
      return token
    },
    async session({ session, token }): Promise<DefaultSession & { user: ExtendedUser }> {
      return {
        ...session,
        user: {
          ...session.user,
          userid: token.id as string,
          email: token.email as string,
          isNewUser: token.isNewUser as boolean,
          login_method: token.login_method as string,
        },
      }
    },
  },
})

