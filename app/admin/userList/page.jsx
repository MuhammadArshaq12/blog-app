'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ListUserPage = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/user'); // Adjust this endpoint as per your API
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/api/user?id=${id}`); // Adjust this endpoint as per your API
      toast.success('User Deleted');
      fetchUsers(); // Refresh user list after deletion
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h1>All Users</h1>
      <div className="relative h-[80vh] max-w-[1000px] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-xs text-gray-700 text-left uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">User Name</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">PhoneNumber</th>
              <th scope="col" className="px-6 py-3">Password</th>
              <th scope="col" className="px-6 py-3">Email Verified</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td className="px-6 py-3">{user.name}</td>
                <td className="px-6 py-3">{user.email}</td>
                <td className="px-6 py-3">{user.phoneNumber}</td>
                <td className="px-6 py-3">{user.password}</td>
                <td className="px-6 py-3">{user.isVerified ? "Yes" : "No"}</td>
                <td className="px-6 py-3">
                  <button onClick={() => deleteUser(user._id)} className="text-red-500">
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

export default ListUserPage;
