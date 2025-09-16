"use client";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';

const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const router = useRouter();

    const handleLogin = async () => {
        try {
            setLoading(true);
            setError('');
            setSuccess('');
            const result = await signIn('credentials', {
                email: email,
                password: password,
                redirect: false,
            });

            if (result?.ok) {
                toast('Sign in successful', {
                    description: 'You have successfully signed in.'
                });
                setSuccess('Sign in successful');
                if (result.ok) {
                    router.push(`/`);
                    toast('Log in successful', {
                        description: `Redirecting to...`,
                        duration: 5000,
                    });
                } else {
                    throw new Error(result.error || 'Authentication failed');
                }
            }
            if (result?.error) {
                const errorMessages: Record<string, string> = {
                    'CredentialsSignin': 'Invalid credentials',
                    'EmailVerification': 'Please verify your email address',
                };
                toast('Some Error occurred', {
                    description: errorMessages[result.error] || result.error,
                });
                console.log('Error:', errorMessages[result.error] || result.error);
                throw new Error(errorMessages[result.error] || result.error);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
                toast('Login failed', { description: error.message });
            } else {
                setError('An unknown error occurred');
                toast('Login failed', { description: 'An unknown error occurred' });
            }
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md flex flex-col items-center">
                {/* Logo Placeholder */}
                <div className="mb-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500">
                        <img src="http://nmci.co.in/wp-content/uploads/2023/01/NMCI-Logo-1.png" alt="NMCI Logo" className="w-12 h-12" />
                    </div>
                </div>
                <h1 className="text-2xl font-semibold mb-2 text-gray-800">Login</h1>
                <p className="mb-4 text-gray-600 text-center text-sm">
                    Please enter your credentials to log in to NMCI Admin Dashboard
                </p>
                {error && <p className='text-red-500 mb-2 text-center'>{error}</p>}
                {success && <p className='text-green-500 mb-2 text-center'>{success}</p>}
                <form
                    className='w-full flex flex-col gap-4'
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                >
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-blue-600 text-white rounded px-4 py-2 font-semibold transition hover:bg-blue-700 disabled:bg-blue-300`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Logging in...
                            </span>
                        ) : 'Log in'}
                    </button>
                </form>
                {/* Optional: Add a "Forgot password?" link */}
                <div className="mt-4 text-sm text-gray-500">
                    <a href="#" className="hover:underline">Forgot password?</a>
                </div>
            </div>
        </div>
    )
}

export default Login