'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ListCommentsPage = () => {
  const [comments, setComments] = useState([]);

  // Fetch comments from API
  const fetchComments = async () => {
    const response = await axios.get('/api/comment');
    setComments(response.data.comments);
  };

  // Delete a comment
  const deleteComment = async (id) => {
    try {
      await axios.delete(`/api/comment?id=${id}`);
      toast.success('Comment Deleted');
      fetchComments(); // Re-fetch comments after deletion
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  useEffect(() => {
    fetchComments(); // Fetch comments when page loads
  }, []);

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h1>All Comments</h1>
      <div className="relative h-[80vh] max-w-[850px] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-xs text-gray-700 text-left uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Blog Post</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Comment</th>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment, index) => (
              <tr key={index}>
                <td className="px-6 py-3">{comment.blogId?.title || "No title"}</td>
                <td className="px-6 py-3">{comment.name}</td>
                <td className="px-6 py-3">{comment.comment}</td>
                <td className="px-6 py-3">{new Date(comment.date).toLocaleDateString()}</td>
                <td className="px-6 py-3">
                  <button onClick={() => deleteComment(comment._id)} className="text-red-500">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListCommentsPage;
