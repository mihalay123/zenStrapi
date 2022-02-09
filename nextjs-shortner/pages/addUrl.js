import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useContext, useState } from 'react'
import MyContext from '../lib/context'
import { useRouter } from 'next/router'
import { logout } from '../lib/auth'
import { create } from '../lib/shortener'

export default function AddUrl() {
  const { isLoggedIn, setUser } = useContext(MyContext)
  const [url, setUrl] = useState('')
  const [alias, setAlias] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const router = useRouter()
  useEffect(() => {
    if (!isLoggedIn) {
      return router.push('/login')
    }
  }, [isLoggedIn])
  const shorten = async () => {
    if (!url) return setErrors({ url: 'Url must not be empty' })
    if (!alias) return setErrors({ alias: 'Alias must not be empty' })
    setLoading(true)
    const short = await create(url, alias)
    setLoading(false)
    if (short.data && !short.error) {
      router.push('/dashboard')
    } else {
      setErrors({ server: short?.error?.message || 'Error from server' })
    }
  }
  const signOut = () => {
    logout()
    setUser(null)
    router.push('/login')
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Add Url</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="align-center flex h-32 w-full justify-between p-4 text-6xl font-bold text-blue-600">
        <h1 className="text-6xl font-bold text-blue-600">Url Shortener</h1>
        <span
          className="cursor-pointer text-sm font-bold text-red-600"
          onClick={() => signOut()}
        >
          Logout
        </span>
      </header>
      <main className="mt-0 flex w-full flex-1 flex-col items-center px-8 text-center">
        <p className="flex w-full flex-wrap text-lg font-bold">Fill the form</p>
        <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
          <form
            className="mt-8 w-full max-w-lg"
            onSubmit={(e) => {
              e.preventDefault()
              shorten()
            }}
          >
            <div className="-mx-3 mb-2 flex flex-wrap">
              <div className="mb-6 w-full px-3 md:mb-0">
                <input
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter url"
                  className={`mb-4 block w-full appearance-none rounded border py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none ${
                    errors.url ? 'border-red-500' : 'border-gray-200'
                  }`}
                  id="grid-url"
                  type="text"
                />
                {errors.url ? (
                  <p className="text-xs italic text-red-500">{errors.url}</p>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="-mx-3 mb-2 flex flex-wrap">
              <div className="mb-6 w-full px-3 md:mb-0">
                <input
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="Enter alias"
                  className={`mb-4 block w-full appearance-none rounded border py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none ${
                    errors.alias ? 'border-red-500' : 'border-gray-200'
                  }`}
                  id="grid-alias"
                  type="text"
                />
                {errors.alias ? (
                  <p className="text-xs italic text-red-500">{errors.alias}</p>
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
              <span className="pt-2 text-blue-600 hover:text-gray-600 md:p-6">
                {' '}
                <Link href="/dashboard"> Back to Dashboard</Link>
              </span>
              <button
                disabled={loading}
                className={`mt-3 flex w-full justify-center rounded-md px-3 py-3 uppercase hover:bg-gray-200 hover:text-gray-900 md:w-1/2 ${
                  loading
                    ? 'cursor-not-allowed  bg-gray-200 text-black'
                    : 'cursor-pointer  bg-gray-900 text-white'
                }`}
              >
                {loading ? <>loading &nbsp;...</> : 'Shorten'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
