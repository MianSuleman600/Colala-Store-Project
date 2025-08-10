// src/components/AccessControl.jsx
import React, { useState } from "react";
import { X } from "lucide-react";
import Button from "../ui/Button";
import ScrollToTop from "../ui/ScrollToTop";

import EditIcon from "../../assets/icons/edit.png";
import TrashIcon from "../../assets/icons/delete.png";

// Dummy data for users and roles (replace with API data later)
const dummyUsers = [
  { id: 1, email: "abcdef@gmail.com", role: "Admin", avatar: "https://googleusercontent.com/file_content/1" },
  { id: 2, email: "abcdef@gmail.com", role: "Admin", avatar: "https://googleusercontent.com/file_content/1" },
  { id: 3, email: "abcdef@gmail.com", role: "Admin", avatar: "https://googleusercontent.com/file_content/1" },
];

const roles = [
  { name: "Admin", features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"] },
  { name: "Role 2", features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"] },
];

const AccessControl = ({ brandColor, contrastTextColor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Open modal
  const handleAddUserClick = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
    setIsDropdownOpen(false);
    setEmail("");
    setPassword("");
  };

  // Save user (connect to backend later)
  const handleSaveUser = (e) => {
    e.preventDefault();
    console.log("User Saved:", { email, password, selectedRole });
    handleCloseModal();
  };

  return (
    <div className="flex-1 p-6 rounded-2xl bg-gray-50 min-h-screen">
      <ScrollToTop />
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-1">Access Control</h2>
        <p className="text-gray-500 mb-6">
          Grant users access to manage parts of your account. Input the user's email and you can add a unique password for each user.
        </p>

        {/* User List */}
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
                  <img src={EditIcon} alt="Edit" className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <img src={TrashIcon} alt="Delete" className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New User Button */}
        <div className="mt-8">
          <Button
            className="w-full rounded-2xl font-semibold py-4"
            style={{ backgroundColor: brandColor, color: contrastTextColor }}
            onClick={handleAddUserClick}
          >
            Add New User
          </Button>
        </div>
      </div>

      {/* Modal */}
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
                {/* Email */}
                <input
                  type="email"
                  placeholder="User Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                {/* Password */}
                <input
                  type="password"
                  placeholder="User Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                {/* Role Dropdown */}
                <div className="relative">
                  <div
                    className="p-4 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer flex items-center justify-between"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                  >
                    <span className={selectedRole ? "text-gray-900" : "text-gray-500"}>
                      {selectedRole || "Select Role"}
                    </span>
                    <span className="text-gray-500">&#9662;</span>
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                      {roles.map((role) => (
                        <div
                          key={role.name}
                          onClick={() => {
                            setSelectedRole(role.name);
                            setIsDropdownOpen(false);
                          }}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                        >
                          {role.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Role Details */}
              {selectedRole && (
                <div className="mt-4">
                  {roles
                    .filter((role) => role.name === selectedRole)
                    .map((role) => (
                      <div key={role.name}>
                        <h3 className="font-semibold text-lg mb-2">{role.name}</h3>
                        <p className="text-gray-500 text-sm mb-3">
                          Anyone with the {role.name} role has access to:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                          {role.features.map((feature) => (
                            <li key={feature} className="text-sm">{feature}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              )}

              {/* Save Button */}
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
