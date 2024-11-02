import React from 'react'

const BlogTableItem = ({ authorImg, title, category,author, date, deleteBlog, editBlog, mongoId }) => {
  const BlogDate = new Date(date);
  
  return (
    <tr className='bg-white border-b'>
      <th scope='row' className='items-center gap-3 hidden sm:flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
        <p>{author ? author : "No author"}</p>
      </th>
      <td className='px-6 py-4'>
        {title ? title : "No title"}
      </td>
      <td className='px-6 py-4'>
        {category ? category : "No Category"}
      </td>
      <td className='px-6 py-4'>
        {BlogDate.toDateString()}
      </td>
      <td className='px-6 py-4 cursor-pointer'>
        <button onClick={() => deleteBlog(mongoId)} className="text-red-500">
          Delete
        </button>
        &nbsp;&nbsp;&nbsp;
        <button onClick={() => editBlog()} className="text-blue-500">
          Edit
        </button>
      </td>
    </tr>
  )
}

export default BlogTableItem
