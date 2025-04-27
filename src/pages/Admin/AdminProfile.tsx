
import React from 'react';
import { User } from 'lucide-react';

const AdminProfile = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Profile</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mr-4">
            <User size={40} className="text-gray-500" />
          </div>
          <div>
            <h2 className="text-xl font-medium">Admin User</h2>
            <p className="text-gray-500">Administrator</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value="Admin User"
              readOnly
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value="admin@example.com"
              readOnly
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <input
              type="text"
              value="Administrator"
              readOnly
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Login
            </label>
            <input
              type="text"
              value={new Date().toLocaleString()}
              readOnly
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
