'use client'
import 'tailwindcss/tailwind.css';
import { assets } from '@/Assets/assets';
import Footer from '@/Components/Footer';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@/app/userContext/UserContext';
import React, { useEffect, useState } from 'react';
import Header from '@/Components/Header';
import './blog.css';

const BlogPostPage = ({ params }) => {
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: '', comment: '' });
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useUser();

  const handleLogout = () => {
    setUser(null);
  };

  const fetchBlogData = async () => {
    try {
      const response = await axios.get('/api/blog', {
        params: { id: params.id }
      });
      setData(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    const response = await axios.get('/api/comment', {
      params: { blogId: params.id }
    });
    setComments(response.data.comments);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/comment', {
        blogId: params.id,
        ...newComment,
      });
      if (response.data.success) {
        setNewComment({ name: '', comment: '' });
        fetchComments();
      }
    } catch (error) {
      console.error("Error posting comment", error);
    }
  };

  useEffect(() => {
    // Trigger page reload twice
    let reloadCount = sessionStorage.getItem('reloadCount') || 0;
    reloadCount = parseInt(reloadCount);

    if (reloadCount < 2) {
      sessionStorage.setItem('reloadCount', reloadCount + 1);
      window.location.reload();
    } else {
      sessionStorage.removeItem('reloadCount');
      fetchBlogData();
      fetchComments();
    }
  }, []);

  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('/api/adsense');
        setBanners(response.data);
      } catch (error) {
        console.error('Failed to fetch banners:', error);
      }
    };
    fetchBanners();
  }, []);

  const getEmbedUrl = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match && match[1] ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (data ? (
    <div className="min-h-screen bg-gray-50">
    <Header></Header>

    {/* Author Info */}
    <div className="relative bg-gradient-to-b from-blue-800 to-transparent pt-16 pb-32">
      <div className="text-center text-white">
        <h1 className="text-3xl sm:text-5xl font-bold max-w-[800px] mx-auto leading-tight px-4">{data.title}</h1>
        <div className="mt-8 flex flex-col items-center">
          <div className="relative w-20 h-20">
            <Image
              className="rounded-full border-4 border-white shadow-lg object-cover"
              src={data.authorImg}
              fill
              alt={data.author}
            />
          </div>
          <p className="mt-4 text-xl font-medium">{data.author}</p>
          <div className="flex items-center mt-2">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{new Date(data.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>

    <div className="content-container flex flex-col lg:flex-row justify-between gap-8 p-10">
      {/* Left Ads */}
      <div className="ad-side flex flex-col gap-3 w-full lg:w-1/4">
      {banners.length > 0 ? (
        <div className="ad-banner h-[300px] sm:h-[450px] left-banner p-4 bg-gray-200 rounded-lg shadow-lg"
        dangerouslySetInnerHTML={{ __html: banners[0].ad_code }}></div>
      ) : (
        <p></p>
      )}
       {banners.length > 1 ? (
        <div className="ad-banner h-[300px] sm:h-[450px] left-banner p-4 bg-gray-200 rounded-lg shadow-lg"
        dangerouslySetInnerHTML={{ __html: banners[1].ad_code }}></div>
      ) : (
        <p></p>
      )}
      </div>

      {/* Main Content */}
      <div className="main-content w-full lg:w-1/2">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="relative w-full h-[300px] sm:h-[400px]">
            <Image className="object-cover" src={data.image} fill alt="" />
          </div>

          <div className="p-8">
            <div className="prose max-w-none mb-8 pb-4 border-b" dangerouslySetInnerHTML={{ __html: data.description }}></div>

            {/* YouTube Video */}
            {data.youtubeLink && (
              <div className="my-8 rounded-lg overflow-hidden shadow-lg">
                <iframe
                  className="w-full aspect-video"
                  src={getEmbedUrl(data.youtubeLink)}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube video"
                ></iframe>
              </div>
            )}

            {/* Comments Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>
              {/* Comments List */}
              {user ? (
                <form onSubmit={handleCommentSubmit} className="space-y-4 mb-8">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={newComment.name}
                    onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                  <textarea
                    placeholder="Share your thoughts..."
                    value={newComment.comment}
                    onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all min-h-[120px]"
                    required
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Post Comment
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Please log in to comment on this post.</p>
                </div>
              )}

              <div className="space-y-6">
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div key={index} className="mt-3 bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {comment.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">{comment.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(comment.date).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="mt-2 text-gray-700">{comment.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="mt-3 text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Ads */}
      <div className="ad-side flex flex-col gap-3 w-full lg:w-1/4">
      {banners.length > 2 ? (
        <div className="ad-banner h-[300px] sm:h-[450px] right-banner p-4 bg-gray-200 rounded-lg shadow-lg"
        dangerouslySetInnerHTML={{ __html: banners[2].ad_code }}></div>
      ) : (
        <p></p>
      )}
       {banners.length > 3 ? (
        <div className="ad-banner h-[300px] sm:h-[450px] right-banner p-4 bg-gray-200 rounded-lg shadow-lg"
        dangerouslySetInnerHTML={{ __html: banners[3].ad_code }}></div>
      ) : (
        <p></p>
      )}
      </div>
    </div>

    <div className="px-10">
      <div>
        {banners.length > 4 ? (
          <div className="ad-banner mt-8 "
            dangerouslySetInnerHTML={{ __html: banners[4].ad_code }}
          />
        ) : (
          <p></p>
        )}
      </div>
    </div>
    <Footer />
  </div>
  ) : null);
};

export default BlogPostPage;
