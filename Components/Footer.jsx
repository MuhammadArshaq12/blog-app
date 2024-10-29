import { assets } from '@/Assets/assets';
import Image from 'next/image';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import './css/footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    const response = await axios.post('/api/email', formData);
    if (response.data.success) {
      toast.success(response.data.msg);
      setEmail('');
    } else {
      toast.error('Error');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Email Subscription Section */}
        <div className="email-subscription">
          <h3>Stay Updated</h3>
          <p>Subscribe to our newsletter to get the latest updates.</p>
          <form onSubmit={onSubmitHandler} className="email-form">
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Enter your email"
              className="email-input"
              required
            />
            <button type="submit" className="subscribe-button">
              Subscribe
            </button>
          </form>
        </div>

        {/* Footer Content */}
        <div className="footer-content">
          {/* Logo Section */}
          <div className="logo-section">
            <Image
              src={assets.logo_light}
              alt="Logo"
              width={150}
              height={50}
              className="hover-opacity-90"
            />
          </div>

          {/* Social Media Icons */}
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <Image src={assets.facebook_icon} alt="Facebook" width={30} height={30} />
              <span className="sr-only">Facebook</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <Image src={assets.twitter_icon} alt="Twitter" width={30} height={30} />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <Image src={assets.googleplus_icon} alt="Google Plus" width={30} height={30} />
              <span className="sr-only">Google Plus</span>
            </a>
          </div>

          {/* Copyright */}
          <div className="copyright">
            <p>© {new Date().getFullYear()} Blogger. All rights reserved.</p>
          </div>
        </div>

        {/* Legal Links */}
        <div className="legal-links">
          <Link href="/faq">FAQ</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </div>

        {/* Bottom Border */}
        <div className="bottom-border">
          <p>Powered by Blogger. Designed with care.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
