// BlogTableItem.jsx
import React from 'react';
import '../css/item.css';

const BlogTableItem = ({ 
  authorImg, 
  title, 
  category, 
  author, 
  date, 
  isRegisteredOnly,
  deleteBlog, 
  editBlog, 
  mongoId 
}) => {
  const BlogDate = new Date(date);
  
  return (
    <tr className='table-row'>
      <td className='table-cell'>
        {author ? author : "No Author"}
      </td>
      <td className='table-cell'>
        {title ? title : "No title"}
      </td>
      <td className='table-cell'>
        {category ? category : "No Category"}
      </td>
      <td className='table-cell'>
        {BlogDate.toDateString()}
      </td>
      <td className='table-cell'>
  {isRegisteredOnly ? "Yes" : "No"}
</td>
      <td className='table-cell actions'>
        <button 
          onClick={() => editBlog()} 
          className="edit-button"
        >
          Edit
        </button>
        <button 
          onClick={() => deleteBlog(mongoId)} 
          className="delete-button"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default BlogTableItem;
