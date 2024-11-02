'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Image from 'next/image';

const EditBlogModal = ({ blog, onClose, onUpdate }) => {
  const [data, setData] = useState({ ...blog });
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(blog.image);
  const [youtubeError, setYoutubeError] = useState("");

  const fetchCategories = async () => {
    const response = await axios.get('/api/category');
    setCategories(response.data.categories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const validateYouTubeLink = (link) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(link);
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));

    if (name === "youtubeLink") {
      if (validateYouTubeLink(value)) {
        setYoutubeError("");
      } else {
        setYoutubeError("Please enter a valid YouTube link");
      }
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (youtubeError) {
      toast.error("Please fix errors before submitting.");
      return;
    }
  
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('author', data.author);
    formData.append('authorImg', data.authorImg);
    formData.append('youtubeLink', data.youtubeLink);
  
    const fileInput = document.querySelector('input[type="file"]'); // Update selector as necessary
if (fileInput.files.length > 0) {
    formData.append('image', fileInput.files[0]); // Append the first selected file
}
    try {
        for (let [key, value] of formData.entries()) {
    console.log(key, value);
}

      const response = await axios.put('/api/blog', formData, {
        params: { id: blog._id }, 
      });
      if (response.data.success) {
        toast.success(response.data.msg);
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error(error); 
      toast.error("Error updating blog");
    }
  };
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 mt-20">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Blog Post</h2>
        </div>

        {/* Form Content */}
        <form onSubmit={onSubmitHandler} className="p-6 space-y-6">
          {/* Thumbnail Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Blog Thumbnail
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  src={previewImage}
                  alt="Blog thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                           file:rounded-lg file:border file:border-gray-300 
                           file:text-sm file:font-semibold file:bg-white 
                           hover:file:bg-gray-50 cursor-pointer"
                />
                
              </div>
            </div>
          </div>

          {/* Title and Author Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Blog Title
              </label>
              <input
                type="text"
                name="title"
                value={data.title}
                onChange={onChangeHandler}
                placeholder="Enter blog title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Author Name
              </label>
              <input
                type="text"
                name="author"
                value={data.author}
                onChange={onChangeHandler}
                placeholder="Enter author name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Blog Content
            </label>
            <textarea
              name="description"
              value={data.description}
              onChange={onChangeHandler}
              placeholder="Write your blog content here..."
              rows="8"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-blue-500 resize-none"
              required
            />
          </div>

          {/* Category and YouTube Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={data.category}
                onChange={onChangeHandler}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-blue-500 bg-white"
                required
              >
                {categories.map((category, index) => (
                  <option key={index} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                YouTube Link
              </label>
              <input
                type="text"
                name="youtubeLink"
                value={data.youtubeLink}
                onChange={onChangeHandler}
                placeholder="Paste YouTube URL"
                className={`w-full px-3 py-2 border rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-blue-500 ${
                           youtubeError ? 'border-red-500' : 'border-gray-300'
                         }`}
              />
              {youtubeError && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {youtubeError}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 
                       hover:bg-gray-50 focus:outline-none focus:ring-2 
                       focus:ring-gray-500 focus:border-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!!youtubeError}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 
                       disabled:cursor-not-allowed transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlogModal;