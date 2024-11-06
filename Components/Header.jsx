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
    router.push("/");

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

    </header>
  );
};

export default Header;