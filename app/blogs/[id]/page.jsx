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
        const filteredBanners = response.data.banners.filter(banner => banner.page === 'blog detail');
        setBanners(filteredBanners);
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
          {banners.filter(banner => banner.position === 'left').slice(0, 2).map((banner, index) => (
            <div
              key={index}
              className="ad-banner h-[300px] sm:h-[450px] left-banner p-4 rounded-lg "
              dangerouslySetInnerHTML={{ __html: banner.ad_code }}
            ></div>
          ))}
        </div>

        {/* Main Content */}
        <div className="main-content w-full lg:w-1/2">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* <div className="relative w-full h-[300px] sm:h-[400px]">
            <Image className="object-cover" src={data.image} fill alt="" />
          </div> */}

            <div className="p-8">
              {/* Action Buttons */}
              {/* <div className="flex justify-between items-center mb-8 pb-4 border-b">
              <div className="flex gap-4">
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span>Like</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Comment</span>
                </button>
              </div>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>Save</span>
                </button>
              </div>
            </div> */}

              {/* YouTube Video */}
              {data.youtubeLink && (
                <div className="yt-video my-8 rounded-lg overflow-hidden shadow-lg">
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

              <div className="prose max-w-none mb-8 pb-4 border-b" dangerouslySetInnerHTML={{ __html: data.description }}></div>


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
          {banners.filter(banner => banner.position === 'right').slice(0, 2).map((banner, index) => (
            <div
              key={index}
              className="ad-banner h-[300px] sm:h-[450px] right-banner p-4  rounded-lg "
              dangerouslySetInnerHTML={{ __html: banner.ad_code }}
            ></div>
          ))}
        </div>
      </div>

      <div className="px-20">
        <div className="ml-[50px]">
          {banners.filter(banner => banner.position === 'bottom').length > 0 && (
            <div
              className="ad-banner mt-8"
              dangerouslySetInnerHTML={{
                __html: banners.find(banner => banner.position === 'bottom').ad_code,
              }}
            ></div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  ) : null);
};

export default BlogPostPage;
