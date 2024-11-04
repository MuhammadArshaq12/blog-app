import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditBlogForm = ({ blogData, onClose, onUpdate }) => {
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null); // Initialize as null for file input
  const [data, setData] = useState(blogData);
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
    setData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "youtubeLink") {
      if (validateYouTubeLink(value)) {
        setYoutubeError(""); 
      } else {
        setYoutubeError("Please enter a valid YouTube link");
      }
    }
  };

  const onImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file); // Set the selected image file
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
    formData.append('youtubeLink', data.youtubeLink);

    // Ensure the new image is appended if it's selected
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.put(`/api/blog?id=${data._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        toast.success(response.data.msg);
        onUpdate(); // Call the update function provided by the parent component
        onClose(); // Close the modal or form
      } else {
        toast.error("Error updating blog");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("An error occurred while updating the blog");
    }
  };

  return (
    <div className='modal'>
      <div className='modal-content'>
        <button onClick={onClose} className='close-button'>×</button>
        <form onSubmit={onSubmitHandler} className='pt-5 px-5 sm:pt-12 sm:pl-16'>
          <p className='text-xl mt-4'>Blog title</p>
          <input 
            name='title' 
            onChange={onChangeHandler} 
            value={data.title} 
            className='w-full sm:w-[500px] mt-4 px-4 py-3 border' 
            type="text" 
            required 
          />
          <p className='text-xl mt-4'>Author Name</p>
          <input 
            name='author' 
            onChange={onChangeHandler} 
            value={data.author} 
            className='w-full sm:w-[500px] mt-4 px-4 py-3 border' 
            type="text" 
            required 
          />
          <p className='text-xl mt-4'>Blog Description</p>
          <textarea 
            name='description' 
            onChange={onChangeHandler} 
            value={data.description} 
            className='w-full sm:w-[500px] mt-4 px-4 py-3 border' 
            rows={6} 
            required 
          />
          <p className='text-xl mt-4'>Blog category</p>
          <select 
            name="category" 
            onChange={onChangeHandler} 
            value={data.category} 
            className='w-40 mt-4 px-4 py-3 border text-gray-500'
          >
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
          
          {/* Image Upload Field */}
          <p className='text-xl mt-4'>Blog Image</p>
          <input 
            type="file" 
            accept="image/*" 
            onChange={onImageChange} 
            className='w-full sm:w-[500px] mt-4 px-4 py-3 border' 
          />
          
          <button type="submit" className='mt-8 w-40 h-12 bg-black text-white'>UPDATE</button>
        </form>
      </div>
    </div>
  );
};

export default EditBlogForm;
