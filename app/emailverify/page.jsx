'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import Link from 'next/link';
import './page.css';

const VerifyEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('Verifying...');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      const verifyToken = async () => {
        try {
          const response = await axios.get(`/api/emailverify?token=${token}`);
          if (response.status === 200) {
            setVerificationStatus(response.data.message || 'Email verified successfully!');
            setIsVerified(true);
          } else {
            setVerificationStatus('Invalid or expired token.');
          }
        } catch (error) {
          setVerificationStatus('An error occurred during verification.');
          console.error('Verification error:', error);
        } finally {
          setIsLoading(false);
        }
      };

      verifyToken();
    } else {
      setVerificationStatus('No token provided. Please check the verification link.');
      setIsLoading(false);
    }
  }, [searchParams]);

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        <div className="verify-email-header">
          <h1>Email Verification</h1>
          <div className={`status-indicator ${isVerified ? 'success' : isLoading ? 'loading' : 'error'}`}>
            {isLoading && <div className="loading-spinner"></div>}
            {!isLoading && (isVerified ? '✓' : '×')}
          </div>
        </div>
        <div className={`verify-email-content ${isVerified ? 'success' : isLoading ? '' : 'error'}`}>
          <p>{verificationStatus}</p>
          {isVerified && (
            <Link href="/login">
              <button className="login-button">
                Go to Login Page
                <span className="button-arrow">→</span>
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const VerifyEmailWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <VerifyEmail />
  </Suspense>
);

export default VerifyEmailWithSuspense;
