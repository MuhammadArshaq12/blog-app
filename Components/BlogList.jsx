import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, Search, Filter, X, RefreshCcw } from 'lucide-react';
import BlogItem from './BlogItem';
import './css/bloglist.css';
import RotatingTitles from '@/Components/blogtitle';
import { useUser } from '@/app/userContext/UserContext';


const BlogList = () => {
  const { user } = useUser();

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


  const fetchBanners = async () => {
    try {
      const response = await axios.get('/api/adsense');
      console.log('Response data:', response.data);
      const filteredBanners = response.data.banners.filter(banner => banner.page === 'landing page');
      console.log('Filtered banners:', filteredBanners);
      setBanners(filteredBanners);
    } catch (error) {
      console.error('Failed to fetch banners:', error);
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
    .filter((item) =>
      menu === "All" ? true : item.category.toLowerCase() === menu.toLowerCase()
    )
    .filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    // Add filter based on user login status and "isRegisteredOnly" field
    .filter((item) => (user ? true : item.isRegisteredOnly === false));

  const blogsPerPage = 6;
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const currentBlogs = filteredBlogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


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
      <div>
        {banners.filter(banner => banner.position === 'top').length > 0 ? (
          <div
            className="ad-banner mt-8 center-banner"
            dangerouslySetInnerHTML={{
              __html: banners.find(banner => banner.position === 'top').ad_code,
            }}
          />
        ) : (
          <p></p>
        )}
      </div>

      <br></br>
      <br></br>

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
          {/* <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="filter-button"
          >
            {filterOpen ? <X size={18} /> : <Filter size={18} />}
            <span className="filter-text">Filters</span>
          </button> */}
        </div>

        {/* Category Filters */}
        <div className="category-filters open">
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

        <div>

          {banners.filter(banner => banner.position === 'left').length > 0 ? (
            <div className="ad-banner mt-8"
              dangerouslySetInnerHTML={{
                __html: banners.find(banner => banner.position === 'left').ad_code,
              }}
            />
          ) : (
            <p></p>
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

        <div>
          {banners.filter(banner => banner.position === 'right').length > 0 ? (
            <div className="ad-banner mt-8"
              dangerouslySetInnerHTML={{
                __html: banners.find(banner => banner.position === 'right').ad_code,
              }}
            />
          ) : (
            <p></p>

          )}
        </div>


      </div>


      <div >
        {banners.filter(banner => banner.position === 'bottom').length > 0 ? (
          <div className="ad-banner mt-8 center-banner"
            dangerouslySetInnerHTML={{
              __html: banners.find(banner => banner.position === 'bottom').ad_code,
            }}
          />
        ) : (
          <p></p>
        )}
      </div>

    </div>
  );
};

export default BlogList;