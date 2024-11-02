// Blog List
'use client'
import BlogTableItem from '@/Components/AdminComponents/BlogTableItem';
import EditBlogModal from '@/Components/AdminComponents/blogmodel';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Page = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchBlogs = async () => {
    const response = await axios.get('/api/blog');
    setBlogs(response.data.blogs);
  };

  const deleteBlog = async (mongoId) => {
    const response = await axios.delete('/api/blog', {
      params: { id: mongoId },
    });
    toast.success(response.data.msg);
    fetchBlogs();
  };

  const handleEditClick = (blog) => {
    setSelectedBlog(blog);
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    setSelectedBlog(null);
  };

  const handleUpdateBlogs = () => {
    fetchBlogs();
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
      <h1>All blogs</h1>
      <div className="relative h-[80vh] max-w-[850px] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-xs text-gray-700 text-left uppercase bg-gray-50">
            <tr>
              <th scope="col" className="hidden sm:block px-6 py-3">Author name</th>
              <th scope="col" className="px-6 py-3">Blog Title</th>
              <th scope="col" className="px-6 py-3">Blog Category</th>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-2 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((item) => (
              <BlogTableItem
                key={item._id}
                mongoId={item._id}
                title={item.title}
                category={item.category}
                author={item.author}
                authorImg={item.authorImg}
                date={item.date}
                deleteBlog={deleteBlog}
                editBlog={() => handleEditClick(item)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <EditBlogModal
          blog={selectedBlog}
          onClose={handleCloseModal}
          onUpdate={handleUpdateBlogs}
        />
      )}
    </div>
  );
};

export default Page;
