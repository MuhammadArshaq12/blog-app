import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, Search, Filter, X, RefreshCcw } from 'lucide-react';
import BlogItem from './BlogItem';
import './css/bloglist.css';

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
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
      setIsInitialLoad(false);
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

  const handleRefresh = async () => {
    setLoading(true);
    await fetchBlogs();
    await fetchCategories();
    await fetchBanners();
    setLoading(false);
  };

  if (isInitialLoad) {
    return (
      <div className="initial-load">
        <div className="loader-container">
          <Loader2 className="loader-icon" />
          <div className="loader-overlay"></div>
        </div>
        <p className="loading-text">Loading your personalized content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-title">Unable to Load Content</div>
          <p className="error-message">{error}</p>
          <button onClick={handleRefresh} className="error-button">
            <RefreshCcw size={18} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-list-container">
      {/* Search and Filter Header */}
      <div className="header-section">
        <div className="search-container">
          <div className="search-icon">
            <Search className="icon" />
          </div>
          <input
            type="text"
            placeholder="Search articles by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="filter-button"
          >
            {filterOpen ? <X size={18} /> : <Filter size={18} />}
            <span className="filter-text">Filters</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className={`category-filters ${filterOpen ? 'open' : ''}`}>
          <div className="category-buttons">
            <button
              onClick={() => setMenu('All')}
              className={`category-button ${menu === "All" ? 'active' : ''}`}
            >
              All Posts
            </button>
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setMenu(category.name)}
                className={`category-button ${menu === category.name ? 'active' : ''}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog and Ad Sections */}
      <div className="content-layout">
        {/* Left Banner */}
        <div className="banner-left">
          {banners.length > 0 && (
            <div
              className="ad-banner"
              dangerouslySetInnerHTML={{ __html: banners[0]?.ad_code }}
            />
          )}
        </div>

        {/* Main Content */}
        <div className="main-content">
          {loading ? (
            <div className="blog-grid loading">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="blog-skeleton">
                  <div className="skeleton-image" />
                  <div className="skeleton-content">
                    <div className="skeleton-title" />
                    <div className="skeleton-subtitle" />
                    <div className="skeleton-text">
                      <div className="skeleton-line" />
                      <div className="skeleton-line" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredBlogs.length === 0 ? (
                <div className="no-results">
                  <h3 className="no-results-title">No blogs found</h3>
                  <p className="no-results-text">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
              ) : (
                <div className="blog-grid">
                  {filteredBlogs.map((item, index) => (
                    <div key={index} className="blog-item-wrapper">
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
              )}
            </>
          )}
        </div>

        {/* Right Banner */}
        <div className="banner-right">
          {banners.length > 1 && (
            <div
              className="ad-banner"
              dangerouslySetInnerHTML={{ __html: banners[1]?.ad_code }}
            />
          )}
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="banner-bottom">
        {banners.length > 2 && (
          <div
            className="ad-banner"
            dangerouslySetInnerHTML={{ __html: banners[2]?.ad_code }}
          />
        )}
      </div>
    </div>
  );
};

export default BlogList;