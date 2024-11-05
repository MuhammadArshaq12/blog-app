'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Header from '@/Components/Header';

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
  
    try {
      const response = await axios.post('/api/verify-email', { email });
      console.log('Response:', response.data); // Debugging log
      if (response.data.exists) {
        setEmailVerified(true);
      } else {
        setMessage('Email not found');
      }
    } catch (error) {
      console.error('Error verifying email:', error); // More detailed error logging
      setMessage('Error verifying email');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
        setMessage('Password must be at least 6 characters long');
        return;
    }

    if (newPassword !== confirmPassword) {
        setMessage('Passwords do not match');
        return;
    }

    try {
        // No token required
        await axios.post('/api/reset-password', { email, newPassword });
        setMessage('Password updated successfully');
        setTimeout(() => router.push('/login'), 1000);
    } catch (error) {
        console.error('Error updating password:', error.response ? error.response.data : error);
        setMessage(error.response ? error.response.data.error : 'Error updating password');
    }
};



  return (
   <>
   <Header></Header>
   <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        {message && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            {message}
          </div>
        )}

        {!emailVerified ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 rounded-lg"
            >
              {isLoading ? 'Saving...' : 'Save New Password'}
            </button>
          </form>
        )}
      </div>
    </div>
   </>
  );
};

export default ForgotPassword;
