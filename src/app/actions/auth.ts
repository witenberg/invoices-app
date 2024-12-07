import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from 'bcrypt'
import { findUserByEmail } from "./user";
import NextAuth from "next-auth";


export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: {
    strategy: 'jwt',
  },

  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (credentials === null) return null

        const { email, password } = credentials as { email: string; password: string}

        const user = await findUserByEmail(email);

        if (user) {
          const isMatch = await compare(
            password,
            user.password,
          );

          if (isMatch) {
            return user;
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (user) {
        return true; // Jeśli użytkownik jest poprawny, pozwól na zalogowanie
      } else {
        throw new Error("Authentication failed");
      }
    },

    // async jwt({ token, user }) {
    //   if (user) {
    //     token.id = user.id;
    //     token.role = user.role;
    //   } else {
    //     const dbUser = await User.findOne({ email: token.email });
    //     token.id = dbUser?._id;
    //     token.role = dbUser?.role;
    //   }
    //   return token;
    // },

    // async session({ session, token, user }) {
    //   session.user.id = token.id;
    //   session.user.role = token.role;
    //   return session;
    // },
  },
});
