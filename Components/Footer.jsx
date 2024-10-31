import { assets } from '@/Assets/assets';
import Image from 'next/image';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import './css/footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('email', email);
      const response = await axios.post('/api/email', formData);
      if (response.data.success) {
        toast.success(response.data.msg);
        setEmail('');
      } else {
        toast.error('Error');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <footer className="footer">
      <div className="footer-waves">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="wave">
          <path fill="#111827" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info Section */}
          <div className="footer-section company-info">
            <div className="logo-section">
              <Image
                src={assets.logo_light}
                alt="Logo"
                width={150}
                height={50}
                className="footer-logo"
              />
              <p className="company-description">
                Empowering voices through thoughtful blogging. Join our community of writers and readers.
              </p>
            </div>
            
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Image src={assets.facebook_icon} alt="Facebook" width={24} height={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Image src={assets.twitter_icon} alt="Twitter" width={24} height={24} />
              </a>
              <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Image src={assets.googleplus_icon} alt="Google Plus" width={24} height={24} />
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section quick-links">
            <h3>Quick Links</h3>
            <nav>
              <Link href="/">About Us</Link>
              <Link href="/">Contact</Link>
              <Link href="/">Blog</Link>
              <Link href="/">Careers</Link>
            </nav>
          </div>

          {/* Legal Section */}
          <div className="footer-section legal">
            <h3>Legal</h3>
            <nav>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/faq">FAQ</Link>
            </nav>
          </div>

          {/* Newsletter Section */}
          <div className="footer-section newsletter">
            <h3>Stay Connected</h3>
            <p>Get the latest updates and news delivered to your inbox.</p>
            <form onSubmit={onSubmitHandler} className="newsletter-form">
              <div className="input-group">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Enter your email"
                  required
                />
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} Blogger. 
          </p>
          <p className="attribution">
          All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;