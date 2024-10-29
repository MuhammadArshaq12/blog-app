import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BlogItem from './BlogItem';
import './css/bloglist.css';

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [banners, setBanners] = useState([]);

  const fetchBanners = async () => {
    try {
      const response = await axios.get('/api/banners');
      setBanners(response.data.banners);
    } catch (err) {
      console.error("Failed to load banners", err);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('/api/blog');
      setBlogs(response.data.blogs);
    } catch (err) {
      setError("Failed to load blogs. Please try again.");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/category');
      setCategories(response.data.categories);
    } catch (err) {
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
    fetchBanners();
  }, []);

  const filteredBlogs = blogs
    .filter((item) => menu === "All" ? true : item.category.toLowerCase() === menu.toLowerCase())
    .filter((item) => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
        <button 
          onClick={() => setFilterOpen(!filterOpen)}
          className="filter-button"
        >
          {filterOpen ? "Close Filters" : "Open Filters"}
        </button>
      </div>

      {filterOpen && (
        <div className="category-container">
          <button
            onClick={() => setMenu('All')}
            className={`category-button ${menu === "All" ? 'selected' : ''}`}
          >
            All Posts
          </button>
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setMenu(category.name)}
              className={`category-button ${menu === category.name ? 'selected' : ''}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      <div className="blog-grid">
        {filteredBlogs.map((item, index) => (
          <div key={index} className="blog-item">
            <BlogItem
              id={item._id}
              image={item.image}
              title={item.title}
              description={item.description}
              category={item.category}
            />
          </div>
        ))}
      </div>

      <div className="ad-banner">
        {banners.map((banner, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: banner.ad_code }} />
        ))}
      </div>
    </div>
  );
};

export default BlogList;
