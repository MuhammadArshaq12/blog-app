import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import './css/blogitem.css'; // Import custom CSS here

const BlogItem = ({ title, description, category, image, id, date = "2024" }) => {
  return (
    <article className="blog-item">
      {/* Image Container */}
      <Link href={`/blogs/${id}`} className="image-container">
        <div className="overlay" />
        <Image
          src={image}
          alt={title}
          width={400}
          height={300}
          className="blog-image"
        />
        {/* Category Badge */}
        <div className="category-badge">
          <span>{category}</span>
        </div>
      </Link>

      {/* Content Container */}
      <div className="content-container">
        {/* Title */}
        <Link href={`/blogs/${id}`}>
          <h2 className="blog-title">{title}</h2>
        </Link>

        {/* Description */}
        <p className="blog-description" dangerouslySetInnerHTML={{ __html: description.slice(0, 150) + '...' }} />

        {/* Metadata */}
        <div className="metadata">
          <div className="date">
            <Calendar size={14} />
            <span>{date}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogItem;
