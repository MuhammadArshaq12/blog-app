import { assets } from '@/Assets/assets';
import Image from 'next/image';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import '@/app/globals.css';
import 'tailwindcss/tailwind.css';

const Footer = () => {
  const [email, setEmail] = useState("");
  
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    const response = await axios.post('/api/email', formData);
    if (response.data.success) {
      toast.success(response.data.msg);
      setEmail("");
    } else {
      toast.error("Error");
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      {/* Email Subscription Section */}
      <div className="max-w-lg mx-auto mb-10 text-center">
        <h3 className="text-2xl font-semibold text-white mb-4">Stay Updated</h3>
        <p className="text-sm text-gray-400 mb-6">
          Subscribe to our newsletter to get the latest updates.
        </p>
        <form onSubmit={onSubmitHandler} className="flex items-center border border-gray-700 rounded-lg overflow-hidden">
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter your email"
            className="flex-grow px-4 py-2 text-black outline-none"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 hover:bg-blue-700 transition-all">
            Subscribe
          </button>
        </form>
      </div>
      {/* Footer Content */}
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
          {/* Logo Section */}
          <div className="flex justify-center sm:justify-start">
            <Image src={assets.logo_light} alt="Logo" width={150} height={50} className="hover:opacity-90 transition-opacity" />
          </div>
          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="group">
              <Image
                src={assets.facebook_icon}
                alt="Facebook"
                width={30}
                height={30}
                className="transition-transform transform group-hover:scale-110"
              />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="group">
              <Image
                src={assets.twitter_icon}
                alt="Twitter"
                width={30}
                height={30}
                className="transition-transform transform group-hover:scale-110"
              />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="group">
              <Image
                src={assets.googleplus_icon}
                alt="Google Plus"
                width={30}
                height={30}
                className="transition-transform transform group-hover:scale-110"
              />
              <span className="sr-only">Google Plus</span>
            </a>
          </div>
          {/* Copyright */}
          <div className="text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Blogger. All rights reserved.</p>
          </div>
        </div>
      </div>
      {/* Legal Links */}
      <div className="mt-6 text-center">
        <div className="flex justify-center space-x-6 text-sm text-gray-400">
          <Link href="/faq" className="hover:text-white transition-colors">
            FAQ
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
      {/* Bottom Border */}
      <div className="mt-8 border-t border-gray-800 pt-4 text-center text-xs text-gray-500">
        <p>Powered by Blogger. Designed with care.</p>
      </div>
    </footer>
  );
};

export default Footer;