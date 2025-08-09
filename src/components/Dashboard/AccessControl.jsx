// src/components/AccessControl.jsx
import React, { useState } from 'react';
import {  X } from 'lucide-react'; // Lucide React icons
import Button from '../ui/Button';
import ScrollToTop from '../ui/ScrollToTop';

import EditIcon from '../../assets/icons/edit.png'
import  TrashIcon  from '../../assets/icons/delete.png';

// Dummy data for users and roles
const dummyUsers = [
  { id: 1, email: 'abcdef@gmail.com', role: 'Admin', avatar: 'https://googleusercontent.com/file_content/1' },
  { id: 2, email: 'abcdef@gmail.com', role: 'Admin', avatar: 'https://googleusercontent.com/file_content/1' },
  { id: 3, email: 'abcdef@gmail.com', role: 'Admin', avatar: 'https://googleusercontent.com/file_content/1' },
];

const roles = [
  {
    name: 'Admin',
    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
  },
  {
    name: 'Role 2',
    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
  },
];

const AccessControl = ({brandColor,contrastTextColor}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  console.log(brandColor);
  

  const handleAddUserClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    // Logic to save new user
    console.log('User saved!');
    handleCloseModal();
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <ScrollToTop/>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-1">Access Control</h2>
        <p className="text-gray-500 mb-6">
          Grant users access to manage parts of your account input the user's email and you can add a unique password for each use
        </p>

        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <div className="space-y-4">
          {dummyUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                <img src={user.avatar} alt="User Avatar" className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                  <img src={EditIcon} alt="" className='w-4 h-4'/>
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <img src={TrashIcon} alt="" className='w-4 h-4'/>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Button
            className="w-full rounded-2xl font-semibold py-4"
            style={{ backgroundColor: brandColor, color: contrastTextColor }}
            onClick={handleAddUserClick}
          >
            Add new User
          </Button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar shadow-lg">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center z-10">
              <h2 className="text-xl font-semibold">Add User</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveUser} className="p-6 space-y-6">
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="User Email Address"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="password"
                  placeholder="User Password"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div
                  className="relative p-4 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer flex items-center justify-between"
                  onClick={() => setSelectedRole(selectedRole === null ? roles[0] : null)}
                >
                  <span className="text-gray-500">Select Role</span>
                  <span className="text-gray-500">&gt;</span>
                </div>
              </div>

              {/* Role Details Section */}
              {roles.map((role) => (
                <div key={role.name}>
                  <h3 className="font-semibold text-lg mb-2">{role.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">Anyone with the {role.name} role has access to</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    {role.features.map((feature) => (
                      <li key={feature} className="text-sm">{feature}</li>
                    ))}
                  </ul>
                </div>
              ))}

              <Button
                type="submit"
                className="w-full rounded-2xl font-semibold py-4"
                style={{ backgroundColor: brandColor, color: contrastTextColor }}
              >
                Save User
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessControl;