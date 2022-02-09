import Head from 'next/head'
import React, { useState, useEffect, useContext } from 'react'
import MyContext from '../lib/context'
import { useRouter } from 'next/router'
import { login } from '../lib/auth'
import Link from 'next/link'
export default function Login() {
  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { isLoggedIn, setUser } = useContext(MyContext)
  const router = useRouter()
  const signIn = async () => {
    if (!email) return setErrors({ email: 'Email must not be empty' })
    if (!password) return setErrors({ password: 'Password must not be empty' })

    setLoading(true)
    const reg = await login(email, password)
    setLoading(false)
    if (reg.jwt) {
      setUser(reg.user)
      router.push('/')
    } else {
      setErrors({ server: reg?.error?.message || 'Error from server' })
    }
  }
  useEffect(() => {
    if (isLoggedIn) {
      return router.push('/dashboard')
    }
  }, [isLoggedIn])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold text-blue-600">Url Shortener</h1>

        <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
          <form
            className="mt-8 w-full max-w-lg"
            onSubmit={(e) => {
              e.preventDefault()
              signIn(email, password)
            }}
          >
            <div className="-mx-3 mb-2 flex flex-wrap">
              <div className="mb-6 w-full px-3 md:mb-0">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email..."
                  className={`mb-4 block w-full appearance-none rounded border py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none ${
                    errors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                  id="grid-email"
                  type="email"
                />
                {errors.email ? (
                  <p className="text-xs italic text-red-500">{errors.email}</p>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="-mx-3 mb-6 flex flex-wrap">
              <div className="w-full px-3">
                <span
                  className={`border-r-1 mb-2 inline-flex w-full items-center rounded border text-sm text-gray-700  focus:border-gray-500 focus:bg-white focus:outline-none ${
                    errors.password ? 'border-red-500 ' : ' border-gray-200'
                  }`}
                >
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="******************"
                    className="block w-full appearance-none rounded py-3 px-4 leading-tight"
                    id="grid-password"
                    type="password"
                  />
                </span>
                {errors.password ? (
                  <p className="text-xs italic text-red-500">
                    {errors.password}
                  </p>
                ) : (
                  ''
                )}
              </div>
            </div>
            {errors.server ? (
              <p className="text-xs italic text-red-500">{errors.server}</p>
            ) : (
              ''
            )}
            <div className="flex flex-row flex-wrap justify-between">
              <button
                disabled={loading}
                className={`align-center mt-3 flex w-full justify-center rounded-md px-2 py-3 uppercase hover:bg-gray-200 hover:text-gray-900 md:w-1/2 ${
                  loading
                    ? 'cursor-not-allowed  bg-gray-200 text-black'
                    : 'cursor-pointer  bg-gray-900 text-white'
                }`}
              >
                {loading ? <>loading &nbsp;...</> : 'LOG IN'}
              </button>
              <span className="pt-2 text-blue-600 hover:text-gray-600 md:p-6">
                {' '}
                <Link href="/register">Register</Link>
              </span>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
