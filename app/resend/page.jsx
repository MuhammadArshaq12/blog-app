'use client';
import Header from '@/Components/Header';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResendVerificationForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/resend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            if (data.message === 'Email is already verified') {
                setSuccessMessage('Your email is already verified!');
            } else if (data.message === 'Verification email sent') {
                router.push('/login?message=Check your email, Verification email sent successfully');
            }
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header></Header>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 sm:px-6 lg:px-8 relative">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg z-5">
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                            Resend Verification Link
                        </h2>
                        <p className="text-sm text-gray-600">
                            Enter your email address to receive a new verification email.
                        </p>
                    </div>
                    {successMessage && (
                        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                            <p className="text-sm text-green-700">{successMessage}</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{errorMessage}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-500 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            {isLoading ? 'Sending...' : 'Resend Verification'}
                        </button>

                        {/* Register Link */}
                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-600 mt-2">
                                Don't have an account?{' '}
                                <Link
                                    href="/register"
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Create an account
                                </Link>
                            </p>
                            <p className="text-sm text-gray-600">
                                Back To {' '}
                                <Link
                                    href="/login"
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Login
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
