// pages/admin/add-blog.js
'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { assets } from '@/Assets/assets'

const AddBlogPage = () => {
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "",
    author: "Alex Bennett",
    authorImg: "/author_img.png",
    youtubeLink: ""
  });
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
    setData(data => ({ ...data, [name]: value }));

    if (name === "youtubeLink") {
      if (validateYouTubeLink(value)) {
        setYoutubeError(""); // Clear error if valid
      } else {
        setYoutubeError("Please enter a valid YouTube link");
      }
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
    formData.append('image', image);
    formData.append('youtubeLink', data.youtubeLink);

    const response = await axios.post('/api/blog', formData);
    if (response.data.success) {
      toast.success(response.data.msg);
      setImage(false);
      setData({
        title: "",
        description: "",
        category: "",
        author: "Alex Bennett",
        authorImg: "/author_img.png",
        youtubeLink: ""
      });
    } else {
      toast.error("Error");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='pt-5 px-5 sm:pt-12 sm:pl-16'>
      <p className='text-xl'>Upload thumbnail</p>
      <label htmlFor="image">
        <Image className='mt-4' src={!image ? assets.upload_area : URL.createObjectURL(image)} width={140} height={70} alt='' />
      </label>
      <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden required />
      <p className='text-xl mt-4'>Blog title</p>
      <input name='title' onChange={onChangeHandler} value={data.title} className='w-full sm:w-[500px] mt-4 px-4 py-3 border' type="text" placeholder='Type here' required />
      <p className='text-xl mt-4'>Blog Description</p>
      <textarea name='description' onChange={onChangeHandler} value={data.description} className='w-full sm:w-[500px] mt-4 px-4 py-3 border' placeholder='write content here' rows={6} required />
      <p className='text-xl mt-4'>Blog category</p>
      <select name="category" onChange={onChangeHandler} value={data.category} className='w-40 mt-4 px-4 py-3 border text-gray-500'>
        {categories.map((category, index) => (
          <option key={index} value={category.name}>{category.name}</option>
        ))}
      </select>
      <p className='text-xl mt-4'>YouTube Link</p>
      <input 
        name='youtubeLink' 
        onChange={onChangeHandler} 
        value={data.youtubeLink} 
        className='w-full sm:w-[500px] mt-4 px-4 py-3 border' 
        type="text" 
        placeholder='Enter YouTube link' 
      />
      {youtubeError && <p className='text-red-500 mt-2'>{youtubeError}</p>}
      <br />
      <button type="submit" className='mt-8 w-40 h-12 bg-black text-white'>ADD</button>
    </form>
  );
};

export default AddBlogPage;
