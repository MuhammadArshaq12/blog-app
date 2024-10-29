import React from 'react';
import Image from 'next/image';
import { assets } from '@/Assets/assets';
import Link from 'next/link';
import { useUser } from '@/app/userContext/UserContext'; 
import '@/app/globals.css';
import 'tailwindcss/tailwind.css';

const Header = () => {
  const { user, setUser } = useUser(); // Get user and setUser from context object  

  const handleLogout = () => {
    setUser(null); // Clear user state on logout
  };

  return (
    <header className="w-full bg-white">
      {/* Top Bar */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="relative group">
              <Image 
                src={assets.logo} 
                width={180} 
                height={60} 
                alt="Logo" 
                className="w-[130px] sm:w-[180px] cursor-pointer transition-all duration-300 transform hover:scale-105"
              />
              <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg" />
            </div>

            {/* Conditional Rendering */}
            {user ? (
              <div className="flex items-center space-x-4">
                
                <button 
                  onClick={handleLogout} 
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href={`/login/`}>
                <button className="relative overflow-hidden group bg-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95">
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <Image 
                      src={assets.arrow} 
                      alt="Arrow" 
                      width={18} 
                      height={18} 
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </span>
                  <div className="absolute inset-0 bg-blue-700 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-white via-white to-blue-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center space-y-8">
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-4 left-1/4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
              <div className="absolute -top-4 right-1/4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
            </div>

            {/* Main Heading */}
            <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
              <span className="inline-block transform hover:scale-105 transition-transform duration-300">
                Discover the Latest Blogs
              </span>
            </h1>

            {/* Subheading */}
            <p className="relative max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed">
              Dive into a world of insights, ideas, and inspiration. Stay updated with our 
              <span className="text-blue-600 font-medium"> curated collection </span>
              of articles on a variety of topics, perfect for the curious mind.
            </p>

            {/* Optional Decorative Line */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
