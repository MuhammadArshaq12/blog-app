import React, { useMemo } from 'react';
import './css/title.css';

const RotatingTitles = ({ blogs }) => {
  const lastFiveBlogs = useMemo(() => {
    return blogs.slice(0, 5).map(blog => ({
      title: blog.title,
      category: blog.category
    }));
  }, [blogs]);

  return (
    <div className="rotating-titles-section">
      <div className="rotating-indicator">Latest Updates</div>
      <div className="rotating-titles-container">
        <div className="rotating-titles-wrapper">
          {lastFiveBlogs.map((blog, index) => (
            <div key={index} className="rotating-title-item">
              <span className="rotating-title-category">{blog.category}</span>
              <span className="rotating-title-text">{blog.title}</span>
            </div>
          ))}
        </div>
      </div>
      {/* <div className="rotating-progress">
        <div className="progress-bar"></div>
      </div> */}
    </div>
  );
};

export default RotatingTitles;