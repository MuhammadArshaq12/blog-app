'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Header from '@/Components/Header';

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('/api/adsense');
        console.log('Response data:', response.data);
        const filteredBanners = response.data.banners.filter(banner => banner.page === 'register');
        console.log('Filtered banners:', filteredBanners);
        setBanners(filteredBanners);
      } catch (error) {
        console.error('Failed to fetch banners:', error);
      }
    };

    fetchBanners();
  }, []);
  
  const validatePhoneNumber = (phoneNumber) => {
    const pakistanRegex = /^(?:\+92|03)[0-9]{9}$/;
    const indiaRegex = /^(?:\+91|0)[1-9][0-9]{9}$/;
    return pakistanRegex.test(phoneNumber) || indiaRegex.test(phoneNumber);
  };

  const validateForm = () => {
    const newErrors = {};

    // Phone number validation
    if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/login?message=Check your email, we have sent a verification link');
      } else {
        const data = await response.json();
        setMessage(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setMessage('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Header></Header>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      {/* Top Ad Banner */}
      <div className="fixed top-4 mt-[70px] left-1/2 -translate-x-1/2 p-4 z-100">
          {banners.find(banner => banner.position === 'top') && (
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
        {banners.find(banner => banner.position === 'left') && (
            <div className="ad-banner shadow-lg rounded-lg overflow-hidden">
              <div
                dangerouslySetInnerHTML={{
                  __html: banners.find(banner => banner.position === 'left').ad_code,
                }}
              />
            </div>
          )}
        </div>

      <div className="max-w-md w-full mt-[50px] pb-[70px] space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Create your account
          </h2>
          <p className="text-sm text-gray-600">
            Join us today and get started
          </p>
        </div>

        {/* Error Message */}
        {message && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Phone Number Field */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="mt-1">
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123-456-7890"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>
              )}
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
                value={formData.password}
                onChange={handleChange}
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
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="mt-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
                Login
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
          {banners.find(banner => banner.position === 'bottom') && (
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

export default Register;
