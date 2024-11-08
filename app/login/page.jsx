'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useUser } from '../userContext/UserContext';
import Header from '@/Components/Header';

const Login = () => {
  const router = useRouter();
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (email === "Admin@gmail.com" && password === "Admin1234!") {
      setUser({ name: "admin", email: "Admin@gmail.com" });
      setTimeout(() => {
        router.push('/admin');
      }, 1000);
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser({ name: data.name, email: data.email });
        router.push('/?message=Login successful');
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('/api/adsense');
        const filteredBanners = response.data.filter(banner => banner.page === 'login');
        setBanners(filteredBanners);
      } catch (error) {
        console.error('Failed to fetch banners:', error);
      }
    };

    fetchBanners();
  }, []);

  return (
    <>
      <Header></Header>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 sm:px-6 lg:px-8 relative">
        {/* Top Ad Banner */}
        <div className="fixed top-4 left-1/2 -translate-x-1/2 p-4 z-10">
          {banners.filter(banner => banner.position === 'top').length > 0 && (
            <div className="ad-banner shadow-lg rounded-lg overflow-hidden">
              <div
                dangerouslySetInnerHTML={{
                  __html: banners.find(banner => banner.position === 'top').ad_code,
                }}
              />
            </div>
          )}
        </div>

        {/* Left Ad Banner */}
        <div className="fixed top-1/2 left-4 -translate-y-1/2 p-4 z-10 hidden lg:block">
          {banners.filter(banner => banner.position === 'left').length > 0 && (
            <div className="ad-banner shadow-lg rounded-lg overflow-hidden">
              <div
                dangerouslySetInnerHTML={{
                  __html: banners.find(banner => banner.position === 'left').ad_code,
                }}
              />
            </div>
          )}
        </div>


        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg z-10">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-sm text-gray-600">
              Please sign in to your account
            </p>
          </div>

          {/* Error Message */}
          {message && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{message}</p>
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
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>

            {/* Register Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
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
                  href="/"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Home Page
                </Link>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Forgot your password?{' '}
                <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Reset it here
                </Link>
              </p>

            </div>
          </form>
        </div>

        {/* Right Ad Banner */}
        <div className="fixed top-1/2 right-4 -translate-y-1/2 p-4 z-10 hidden lg:block">
          {banners.filter(banner => banner.position === 'right').length > 0 && (
            <div className="ad-banner shadow-lg rounded-lg overflow-hidden">
              <div
                dangerouslySetInnerHTML={{
                  __html: banners.find(banner => banner.position === 'right').ad_code,
                }}
              />
            </div>
          )}
        </div>

        {/* Bottom Ad Banner */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 p-4 z-10">
          {banners.filter(banner => banner.position === 'bottom').length > 0 && (
            <div className="ad-banner shadow-lg rounded-lg overflow-hidden">
              <div
                dangerouslySetInnerHTML={{
                  __html: banners.find(banner => banner.position === 'bottom').ad_code,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
