import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { assets } from '@/Assets/assets';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import '@/app/globals.css';
import 'tailwindcss/tailwind.css';

const BlogItem = ({ title, description, category, image, id, date = "2024" }) => {
  return (
    <article className="group relative flex flex-col h-full bg-white overflow-hidden rounded-2xl transition-all duration-300">
      {/* Image Container */}
      <Link 
        href={`/blogs/${id}`}
        className="relative aspect-[4/3] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-gray-900/20 transition-colors duration-300 z-10" />
        <Image
          src={image}
          alt={title}
          width={400}
          height={400}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="inline-block px-3 py-1.5 bg-white/95 backdrop-blur-sm text-sm font-medium text-gray-900 rounded-full shadow-sm">
            {category}
          </span>
        </div>
      </Link>

      {/* Content Container */}
      <div className="flex flex-col flex-grow p-6">
        {/* Title */}
        <Link href={`/blogs/${id}`}>
          <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {title}
          </h2>
        </Link>

        {/* Description */}
        <p 
          className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: description.slice(0, 150) + '...' }}
        />

        {/* Metadata & CTA */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          {/* Date */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{date}</span>
            </div>
            {/*<div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>5 min read</span>
            </div>*/}
          </div>

          {/* Read More Link 
          <Link 
            href={`/blogs/${id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group/link hover:text-blue-700 transition-colors duration-200"
          >
            Read more
            <ArrowRight 
              size={16}
              className="transform group-hover/link:translate-x-1 transition-transform duration-200"
            />
          </Link>*/}

        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-600/10 rounded-2xl transition-colors duration-300" />
    </article>
  );
};

export default BlogItem;