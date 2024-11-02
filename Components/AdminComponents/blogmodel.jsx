// EditBlogModal.jsx
'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Image from 'next/image';
import '../css/model.css';

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
  
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput.files.length > 0) {
      formData.append('image', fileInput.files[0]);
    }

    try {
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
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Edit Blog Post</h2>
        </div>

        <form onSubmit={onSubmitHandler} className="modal-form">
          <div className="form-section">
            <label>Blog Thumbnail</label>
            <div className="thumbnail-container">
              <div className="thumbnail-preview">
                <Image
                  src={previewImage}
                  alt="Blog thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="file-input-container">
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="file-input"
                />
              </div>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Blog Title</label>
              <input
                type="text"
                name="title"
                value={data.title}
                onChange={onChangeHandler}
                placeholder="Enter blog title"
                required
              />
            </div>
            <div className="form-group">
              <label>Author Name</label>
              <input
                type="text"
                name="author"
                value={data.author}
                onChange={onChangeHandler}
                placeholder="Enter author name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Blog Content</label>
            <textarea
              name="description"
              value={data.description}
              onChange={onChangeHandler}
              placeholder="Write your blog content here..."
              rows="8"
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={data.category}
                onChange={onChangeHandler}
                required
              >
                {categories.map((category, index) => (
                  <option key={index} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>YouTube Link</label>
              <input
                type="text"
                name="youtubeLink"
                value={data.youtubeLink}
                onChange={onChangeHandler}
                placeholder="Paste YouTube URL"
                className={youtubeError ? 'error' : ''}
              />
              {youtubeError && (
                <p className="error-message">
                  <svg
                    className="error-icon"
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

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!!youtubeError}
              className="btn-save"
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

