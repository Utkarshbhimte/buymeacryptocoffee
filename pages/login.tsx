import React, { useEffect } from 'react'
import { useSession, signIn, signOut, getProviders, ClientSafeProvider } from 'next-auth/client'
import { useRouter } from 'next/router'
import { route } from 'next/dist/server/router'
import Loader from '../utils/loader'

export interface LoginProps {
    providers: Record<string, ClientSafeProvider>;
}

const Login: React.FC<LoginProps> = ({ providers }) => {
    const [session, loading] = useSession()
    const router = useRouter()

    const handleSignIn = () => signIn(providers['twitter'].id, {
        callbackUrl: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/login`
    })

    if(loading){
        return <Loader />
    }

    if (session) {
        router.push('/dashboard')
    }
    return (
        <>
          <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <div>
                    <div>
                      <button
                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        onClick={handleSignIn}
                      >
                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                        <span className='ml-2'>Sign in with Twitter</span>
                      </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </>
    )
}

export default Login

export async function getServerSideProps(context) {
    const providers = await getProviders()
    return {
      props: { providers },
    }
  }