// pages/admin/add-adsense-banner.js
'use client'
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddAdSenseBannerPage = () => {
  const [adCode, setAdCode] = useState('');
  const [status, setStatus] = useState(true); // Assume a checkbox for active/inactive status

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/adsense', {
        ad_code: adCode,
        status,
      });
      if (response.data.success) {
        toast.success('AdSense Banner Added');
        setAdCode('');
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
      <button type="submit" className="mt-8 w-40 h-12 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

export default AddAdSenseBannerPage;
