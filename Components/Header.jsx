// Header.jsx
import React from 'react';
import Image from 'next/image';
import { assets } from '@/Assets/assets';
import Link from 'next/link';
import { useUser } from '@/app/userContext/UserContext'; 
import './css/header.css';

const Header = () => {
  const { user, setUser } = useUser();

  const handleLogout = () => {
    setUser(null); 
  };

  return (
    <header className="header w-full bg-white">
      {/* Top Bar */}
      <div className="header-top-bar border-b bg-white">
        <div className="header-top-bar-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="header-logo-container relative group">
            <Link href="/">
  <Image 
    src={assets.logo} 
    width={180} 
    height={60} 
    alt="Logo" 
    className="header-logo w-[130px] sm:w-[180px] cursor-pointer transition-all duration-300 transform hover:scale-105"
  />
</Link>
               </div>

            {/* Conditional Rendering */}
            {user ? (
              <div className="header-user-actions flex items-center space-x-4">
                <button 
                  onClick={handleLogout} 
                  className="header-logout-button bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href={`/login/`}>
                <button className="header-get-started-button relative overflow-hidden group bg-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95">
                  <span className="header-get-started-button-content relative z-10 flex items-center gap-2">
                    Get Started
                    <Image 
                      src={assets.arrow} 
                      alt="Arrow" 
                      width={18} 
                      height={18} 
                      className="header-get-started-button-arrow group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </span>
                  <div className="header-get-started-button-overlay absolute inset-0 bg-blue-700 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="header-hero-section relative bg-gradient-to-b from-white via-white to-blue-50">
        <div className="header-hero-content max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="header-hero-text-content text-center space-y-8">
            {/* Decorative Elements */}
            <div className="header-hero-decorative-elements absolute inset-0 overflow-hidden pointer-events-none">
              <div className="header-hero-decorative-element-1 absolute -top-4 left-1/4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
              <div className="header-hero-decorative-element-2 absolute -top-4 right-1/4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
            </div>

            {/* Main Heading */}
            <h1 className="header-hero-title relative text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
              <span className="header-hero-title-text inline-block transform hover:scale-105 transition-transform duration-300">
                Discover the Latest Blogs
              </span>
            </h1>

            {/* Subheading */}
            <p className="header-hero-subtitle relative max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed">
              Dive into a world of insights, ideas, and inspiration. Stay updated with our 
              <span className="header-hero-subtitle-highlight text-blue-600 font-medium"> curated collection </span>
              of articles on a variety of topics, perfect for the curious mind.
            </p>

            {/* Optional Decorative Line */}
            <div className="header-hero-decorative-line absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;