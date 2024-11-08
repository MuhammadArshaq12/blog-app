// pages/admin/add-adsense-banner.js
'use client'
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddAdSenseBannerPage = () => {
  const [adCode, setAdCode] = useState('');
  const [status, setStatus] = useState(true);
  const [page, setPage] = useState('login'); // Default page option
  const [position, setPosition] = useState('left'); // Default position option

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/adsense', {
        ad_code: adCode,
        status,
        page,
        position
      });
      if (response.data.success) {
        toast.success('AdSense Banner Added');
        setAdCode('');
        setPage('login'); // Reset to default
        setPosition('left'); // Reset to default
      } else {
        toast.error('Failed to add banner');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="pt-5 px-5 sm:pt-12 sm:pl-16">
      <p className="text-xl">Add Google AdSense Banner</p>
      <textarea
        name="ad_code"
        value={adCode}
        onChange={(e) => setAdCode(e.target.value)}
        className="w-full sm:w-[500px] mt-4 px-4 py-3 border"
        placeholder="AdSense Code"
        required
      />
      <div className="mt-4">
        <label>
          <input
            type="checkbox"
            checked={status}
            onChange={() => setStatus(!status)}
          />
          Active
        </label>
      </div>
      <div className="mt-4">
        <label className="block mb-2">Choose Page:</label>
        <select
          value={page}
          onChange={(e) => setPage(e.target.value)}
          className="w-full sm:w-[200px] px-3 py-2 border"
        >
          <option value="login">Login</option>
          <option value="register">Register</option>
          <option value="blog detail">Blog Detail</option>
          <option value="landing page">Landing Page</option>
        </select>
      </div>
      <div className="mt-4">
        <label className="block mb-2">Choose Position:</label>
        <select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full sm:w-[200px] px-3 py-2 border"
        >
          <option value="left">Left</option>
          <option value="right">Right</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
        </select>
      </div>
      <button type="submit" className="mt-8 w-40 h-12 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

export default AddAdSenseBannerPage;
