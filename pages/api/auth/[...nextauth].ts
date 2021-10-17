import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { FirebaseAdapter } from "@next-auth/firebase-adapter"

import firebase from 'firebase/app'
import 'firebase/firestore'
import { firebaseConfig } from "../../../utils/firebaseClient"

const firestore = (
    firebase.apps[0] ?? firebase.initializeApp(firebaseConfig)
).firestore()

export default NextAuth({
    providers: [
        Providers.Twitter({
            clientId: process.env.TWITTER_API_KEY,
            clientSecret: process.env.TWITTER_API_SECRET_KEY
        })
    ],
    adapter: FirebaseAdapter(firestore),
    pages: {
        signIn: '/login'
    }
})