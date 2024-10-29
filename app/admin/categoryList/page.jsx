// pages/admin/list-categories.js
'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ListCategoryPage = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const response = await axios.get('/api/category');
    setCategories(response.data.categories);
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`/api/category?id=${id}`);
      toast.success('Category Deleted');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h1>All Categories</h1>
      <div className="relative h-[80vh] max-w-[850px] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-xs text-gray-700 text-left uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Category Name</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={index}>
                <td className="px-6 py-3">{category.name}</td>
                <td className="px-6 py-3">
                  <button onClick={() => deleteCategory(category._id)} className="text-red-500">
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

export default ListCategoryPage;
