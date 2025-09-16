/* eslint-disable @next/next/no-img-element */
"use client";

import { signIn, signOut, useSession } from 'next-auth/react';
import React from 'react'
import { useRouter } from 'next/navigation';

// Define the user type based on session.user structure
type UserType = {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
} | null;

const HomePage = () => {
  const [user, setUser] = React.useState<UserType>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  React.useEffect(() => {
    if (session) {
      setUser(session.user);
    }
  }, [session]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-8 text-3xl font-bold text-blue-700">This is Homepage</div>
      {status === 'loading' && <p className="text-gray-500 mb-4">Loading...</p>}
      {status === 'authenticated' && user && (
        <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center mb-6 w-full max-w-md">
          <img
            src={user.image}
            alt={user.name}
            className="w-24 h-24 rounded-full mb-4 border-4 border-blue-200 object-cover"
          />
          <h1 className="text-2xl font-semibold text-blue-800 mb-2">Welcome, {user.name}!</h1>
          <p className="text-gray-700 mb-1"><span className="font-medium">Email:</span> {user.email}</p>
          <p className="text-gray-700 mb-4"><span className="font-medium">Role:</span> {user.role}</p>
        </div>
      )}
      {status === 'unauthenticated' && (
        <p className="text-red-500 mb-4">Please log in to see your details.</p>
      )}
      {status === 'authenticated' && (
        <>
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded shadow transition mb-2"
          >
            Sign Out
          </button>
          <button
            onClick={() => router.push('/chat')}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded shadow transition mb-2"
          >
            Go to Chat
          </button>
        </>
      )}
      {status === 'unauthenticated' && (
        <button
          onClick={() => signIn()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow transition"
        >
          Sign In
        </button>
      )}
    </div>
  )
}
export default HomePage