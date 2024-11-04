// pages/admin/add-blog.js
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { assets } from '@/Assets/assets';
import './add.css';

const AddBlogPage = () => {
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "",
    author: "",
    authorImg: "/author_img.png",
    youtubeLink: ""
  });
  const [youtubeError, setYoutubeError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category');
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
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
      setYoutubeError(validateYouTubeLink(value) ? "" : "Please enter a valid YouTube link");
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
    if (image) formData.append('image', image);
    formData.append('youtubeLink', data.youtubeLink);

    try {
      const response = await axios.post('/api/blog', formData);
      if (response.data.success) {
        toast.success(response.data.msg);
        setImage(null);
        setData({
          title: "",
          description: "",
          category: "",
          author: "",
          authorImg: "/author_img.png",
          youtubeLink: ""
        });
      } else {
        toast.error(response.data.msg || "Error adding blog");
      }
    } catch (error) {
      console.error("Error submitting blog:", error);
      toast.error("Error submitting blog");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='container'>
      <p className='title'>Upload thumbnail</p>
      <label htmlFor="image">
        <Image className='upload-image' src={!image ? assets.upload_area : URL.createObjectURL(image)} width={140} height={70} alt='' />
      </label>
      <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden required />

      <p className='title'>Blog title</p>
      <input name='title' onChange={onChangeHandler} value={data.title} className='input' type="text" placeholder='Type here' required />

      <p className='title'>Author Name</p>
      <input name='author' onChange={onChangeHandler} value={data.author} className='input' type="text" placeholder='Type here' required />

      <p className='title'>Blog Description</p>
      <textarea name='description' onChange={onChangeHandler} value={data.description} className='input' placeholder='write content here' rows={6} required />

      <p className='title'>Blog category</p>
      <select name="category" onChange={onChangeHandler} value={data.category} className='input input-small text-gray-500'>
        {categories.map((category, index) => (
          <option key={index} value={category.name}>{category.name}</option>
        ))}
      </select>

      <p className='title'>YouTube Link</p>
      <input 
        name='youtubeLink' 
        onChange={onChangeHandler} 
        value={data.youtubeLink} 
        className='input' 
        type="text" 
        placeholder='Enter YouTube link' 
      />
      {youtubeError && <p className='error-message'>{youtubeError}</p>}

      <button type="submit" className='submit-button'>ADD</button>
      <br /><br /><br />
    </form>
  );
};

export default AddBlogPage;
