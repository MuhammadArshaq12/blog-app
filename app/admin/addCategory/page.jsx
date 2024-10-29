// pages/admin/add-category.js
'use client'
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddCategoryPage = () => {
  const [category, setCategory] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/category', { name: category });
      if (response.data.success) {
        toast.success('Category Added');
        setCategory('');
      } else {
        toast.error('Failed to add category');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="pt-5 px-5 sm:pt-12 sm:pl-16">
      <p className="text-xl">Add New Category</p>
      <input
        name="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full sm:w-[500px] mt-4 px-4 py-3 border"
        type="text"
        placeholder="Category Name"
        required
      />
      <button type="submit" className="mt-8 w-40 h-12 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

export default AddCategoryPage;
