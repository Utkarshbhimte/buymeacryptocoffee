import React, { useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/client'
import { db } from '../utils/firebaseClient'

const Login: React.FC = () => {
    const [session] = useSession()

    const fetchData = async () => {
        const response = await db.collection('users').get()
        console.log(response?.docs[0]?.data())
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (session) {
        return (
            <>
                Signed in as {session.user.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
    return (
        <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
        </>
    )
}

export default Login