import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import './css/blogitem.css';

const BlogItem = ({ title, description, category, image, id, date = "2024" }) => {
  return (
    <article className="blog-item">
      <Link href={`/blogs/${id}`} className="image-container">
        <div className="image-overlay" />
        <Image
          src={image}
          alt={title}
          width={400}
          height={400}
          className="blog-image"
        />
        <div className="category-badge">
          <span>{category}</span>
        </div>
      </Link>

      <div className="content-container">
        <Link href={`/blogs/${id}`}>
          <h2 className="blog-title">{title}</h2>
        </Link>

        <p 
          className="blog-description"
          dangerouslySetInnerHTML={{ __html: description.slice(0, 150) + '...' }}
        />

        <div className="metadata-container">
          <div className="metadata-items">
            <div className="metadata-item">
              <Calendar size={14} />
              <span>{date}</span>
            </div>
            <div className="metadata-item">
              <Clock size={14} />
              <span>5 min read</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hover-border" />
    </article>
  );
};

export default BlogItem;