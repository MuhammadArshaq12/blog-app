// pages/admin/list-adsense-banners.js
'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ListAdSenseBannerPage = () => {
  const [banners, setBanners] = useState([]);

  const fetchBanners = async () => {
    try {
      const response = await axios.get('/api/adsense');
      setBanners(response.data.banners);
    } catch (error) {
      toast.error('Failed to fetch banners');
    }
  };

  const deleteBanner = async (id) => {
    try {
      await axios.delete(`/api/adsense?id=${id}`);
      toast.success('AdSense Banner Deleted');
      fetchBanners(); // Refresh the banner list after deletion
    } catch (error) {
      toast.error('Failed to delete banner');
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h1>All Google AdSense Banners</h1>
      <div className="relative h-[80vh] max-w-[850px] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-xs text-gray-700 text-left uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Ad Code</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner, index) => (
              <tr key={index}>
                <td className="px-6 py-3">{banner.ad_code}</td>
                <td className="px-6 py-3">{banner.status ? 'Active' : 'Inactive'}</td>
                <td className="px-6 py-3">
                  <button onClick={() => deleteBanner(banner._id)} className="text-red-500">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListAdSenseBannerPage;
