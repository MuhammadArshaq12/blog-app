import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, Search, Filter, X, RefreshCcw } from 'lucide-react';
import BlogItem from './BlogItem';
import './css/bloglist.css';
import RotatingTitles from '@/Components/blogtitle';

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
  const [currentPage, setCurrentPage] = useState(1);

  const blogsPerPage = 6;

  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const currentBlogs = blogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



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
      <div className="ad-banner mt-8">
        {banners.length > 0 ? (
          <div
            dangerouslySetInnerHTML={{ __html: banners[0].ad_code }}
          />
        ) : (
          <div className="ad-banner top-banner">Top Ad Banner</div>
        )}
      </div>


      {/* Main Heading */}
      <h1 className="text-center header-hero-title relative text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
        <span className="header-hero-title-text inline-block transform hover:scale-105 transition-transform duration-300">
          Discover the Latest Blogs
        </span>
      </h1>
      <RotatingTitles blogs={blogs} />
      {/* Search and Filter Header */}
      <div className="header-section mt-10">
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

        <div className="ad-banner mt-8">
          {banners.length > 1 ? (
            <div
              dangerouslySetInnerHTML={{ __html: banners[1].ad_code }}
            />
          ) : (
            <div className="ad-banner left-banner">Left Ad Banner</div>

          )}
        </div>


        {/* Main Content */}
        <div className="main-content">
          {loading ? (
            <div className="blog-grid loading">
              {[1, 2, 3, 4, 5].map((n) => (
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
              {currentBlogs.length === 0 ? (
                <div className="no-results">
                  <h3 className="no-results-title">No blogs found</h3>
                  <p className="no-results-text">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
              ) : (
                <div className="blog-grid">
                  {currentBlogs.map((item, index) => (
                    <div key={index} className="blog-item-wrapper">
                      <BlogItem
                        id={item._id}
                        image={item.image}
                        title={item.title}
                        date={item.date}
                        description={item.description}
                        category={item.category}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              <nav className="pagination-container">
                <div className="pagination-wrapper">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                    aria-label="Previous page"
                  >
                    <svg className="pagination-arrow" viewBox="0 0 24 24">
                      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                    <span>Previous</span>
                  </button>

                  <div className="pagination-numbers">
                    {Array.from({ length: totalPages }, (_, index) => {
                      const pageNumber = index + 1;
                      // Show first page, last page, current page, and one page before and after current
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={index}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`pagination-number ${currentPage === pageNumber ? "active" : ""
                              }`}
                            aria-label={`Page ${pageNumber}`}
                            aria-current={currentPage === pageNumber ? "page" : undefined}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <span key={index} className="pagination-ellipsis">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                    aria-label="Next page"
                  >
                    <span>Next</span>
                    <svg className="pagination-arrow" viewBox="0 0 24 24">
                      <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                    </svg>
                  </button>
                </div>
              </nav>
            </>
          )}
        </div>

        <div className="ad-banner mt-8">
          {banners.length > 2 ? (
            <div
              dangerouslySetInnerHTML={{ __html: banners[2].ad_code }}
            />
          ) : (
            <div className="ad-banner right-banner">Right Ad Banner</div>
          )}
        </div>


      </div>


      <div className="ad-banner mt-8">
        {banners.length > 3 ? (
          <div
            dangerouslySetInnerHTML={{ __html: banners[3].ad_code }}
          />
        ) : (
          <div className="ad-banner bottom-banner">Bottom Ad Banner</div>
        )}
      </div>

    </div>
  );
};

export default BlogList;