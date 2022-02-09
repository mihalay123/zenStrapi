import Head from 'next/head'
import React, { useEffect, useContext, useState } from 'react'
import MyContext from '../lib/context'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { logout } from '../lib/auth'
import { get, deleteAlias } from '../lib/shortener'

export default function Dashboard() {
  const { isLoggedIn, setUser, user, setUrls, urls } = useContext(MyContext)
  const router = useRouter()
  const getAll = async () => {
    let short = await get()
    if (!short) return
    setUrls(short?.data?.attributes?.results || null)
  }
  const deleteShort = async (id) => {
    if (!id) return
    let deleted = await deleteAlias(id)
    if (deleted.data && !deleted.error) {
      await getAll()
    }
  }
  useEffect(() => {
    if (!isLoggedIn) {
      return router.push('/login')
    }
    getAll()
  }, [urls.length])

  const signOut = () => {
    logout()
    setUser(null)
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Dashboard</title>
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
        <p className="flex w-full flex-wrap text-lg font-bold">
          Welcome {user?.username || ''}
        </p>
        <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
          <div className="w-full  overflow-hidden border-b  border-gray-200 shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="bg-gray-50 px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Url
                  </th>
                  <th
                    scope="col"
                    className="bg-gray-50 px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Alias/Shortned
                  </th>
                  <th
                    scope="col"
                    className="bg-gray-50 px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    No of hits
                  </th>
                  <th scope="col" className="bg-gray-50 px-6 py-3">
                    <span className="sr-only">Remove</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {(!urls || urls.length == 0) && (
                  <tr>
                    <td
                      colSpan="3"
                      className="cursor-pointer whitespace-nowrap px-2 py-4"
                    >
                      No record found
                    </td>
                  </tr>
                )}
                {urls &&
                  urls.map((short) => (
                    <tr className="hover:bg-gray-200" key={short.id}>
                      <td
                        className="cursor-pointer whitespace-nowrap px-2 py-4"
                        title="Open Url"
                        onClick={() => {
                          window.open(`${short.url}`, 'blank')
                        }}
                      >
                        <div className="text-sm text-gray-900">
                          {short?.url || 'N/A'}
                        </div>
                      </td>
                      <td
                        className="cursor-pointer whitespace-nowrap px-2 py-4"
                        title="Test Alias"
                        onClick={() => {
                          window.open(`/${short.alias}`, 'blank')
                        }}
                      >
                        <div className="text-sm text-gray-900">
                          {short?.alias || 'N/A'}
                        </div>
                      </td>
                      <td className="cursor-pointer whitespace-nowrap px-2 py-4">
                        <span className="rounded-full  px-2 text-xs font-semibold leading-5 ">
                          <div className="text-sm text-gray-500">
                            {short?.visit || 0}
                          </div>
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-center text-sm font-medium">
                        <button
                          onClick={() => deleteShort(short.id)}
                          className="mx-1 text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Link href="/addUrl">
        <button className="absolute right-0 bottom-0 m-4 h-12 w-12 rounded-full bg-blue-800 p-2 text-lg font-bold text-white hover:bg-blue-400">
          {' '}
          +{' '}
        </button>
      </Link>
    </div>
  )
}
