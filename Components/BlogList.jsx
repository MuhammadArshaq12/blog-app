import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, Search, Filter, X, RefreshCcw } from 'lucide-react';
import BlogItem from './BlogItem';
import './css/bloglist.css'; // Import the custom CSS file

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

  // Fetch banners (replace with your actual API call)
  const fetchBanners = async () => {
    try {
      const response = await axios.get('/api/banners'); // Adjust the endpoint as necessary
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
    fetchBanners(); // Fetch banners on component mount
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
    await fetchBanners(); // Refresh banners as well
    setLoading(false);
  };

  if (isInitialLoad) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-full animate-pulse"></div>
        </div>
        <p className="mt-6 text-lg text-gray-600 animate-pulse">Loading your personalized content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center px-4">
        <div className="text-center p-8 bg-red-50 rounded-xl max-w-md border border-red-100">
          <div className="text-red-500 text-xl font-medium mb-3">Unable to Load Content</div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            <RefreshCcw size={18} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Search and Filter Header */}
      <div className="mb-12">
        <div className="relative max-w-3xl mx-auto mb-8">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
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
            className={`filter-button ${filterOpen ? 'active' : ''}`}
          >
            {filterOpen ? <X size={18} /> : <Filter size={18} />}
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className={`transition-all duration-300 ${filterOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto px-4 py-6 bg-gray-50 rounded-xl">
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
      <div className="flex">
        {/* Left Banner */}
        <div className="w-1/4 mr-4">
          {banners.length > 0 && (
            <div
              className="ad-banner"
              dangerouslySetInnerHTML={{ __html: banners[0]?.ad_code }} // First banner on the left
            />
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-gray-100 rounded-2xl h-[450px]">
                  <div className="h-48 bg-gray-200 rounded-t-2xl" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded w-5/6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredBlogs.length === 0 ? (
                <div className="text-center py-16">
                  <h3 className="text-2xl font-medium text-gray-900 mb-2">No blogs found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
              ) : (
                <div className="blog-list-grid">
  {filteredBlogs.map((item, index) => (
    <div key={index} className="blog-card group">
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
        <div className="w-1/4 ml-4">
          {banners.length > 1 && (
            <div
              className="ad-banner"
              dangerouslySetInnerHTML={{ __html: banners[1]?.ad_code }} // Second banner on the right
            />
          )}
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="mt-12">
        {banners.length > 2 && (
          <div
            className="ad-banner"
            dangerouslySetInnerHTML={{ __html: banners[2]?.ad_code }} // Third banner at the bottom
          />
        )}
      </div>
    </div>
  );
};

export default BlogList;