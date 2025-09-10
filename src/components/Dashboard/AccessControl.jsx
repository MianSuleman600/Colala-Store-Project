// src/components/AccessControl.jsx
import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import ScrollToTop from '../ui/ScrollToTop';
import EditIcon from '../../assets/icons/edit.png';
import TrashIcon from '../../assets/icons/delete.png';

import { useAclUsersQuery, useAclRolesQuery } from '../../services/queries/useAccessControlQuery.js';
import {
  useAclAssignRoleMutation,
  useAclCreateUserMutation,
  useAclInviteUserMutation,
  useAclDeleteUserMutation,
} from '../../services/mutations/useAccessControlMutation.js';

const toast = (type, message) => {
  try {
    window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { type, message } }));
  } catch {}
};

const isValidEmail = (e) => /\S+@\S+\.\S+/.test(String(e || ''));

const AccessControl = ({ brandColor = '#EF4444', contrastTextColor = '#FFFFFF' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editingUser, setEditingUser] = useState(null); // when not null, modal operates as role assignment

  // Data
  const { data: users = [], isLoading: loadingUsers } = useAclUsersQuery();
  const { data: roles = [] } = useAclRolesQuery();

  // Mutations
  const createUser = useAclCreateUserMutation();
  const inviteUser = useAclInviteUserMutation();
  const assignRole = useAclAssignRoleMutation();
  const deleteUser = useAclDeleteUserMutation();

  const roleNames = useMemo(() => roles.map((r) => r.name), [roles]);

  // Open modal to add or edit user
  const openCreateModal = () => {
    setEditingUser(null);
    setEmail('');
    setPassword('');
    setSelectedRole(null);
    setIsDropdownOpen(false);
    setIsModalOpen(true);
  };
  const openEditModal = (user) => {
    setEditingUser(user);
    setEmail(user.email || '');
    setPassword('');
    setSelectedRole(user.role || null);
    setIsDropdownOpen(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setSelectedRole(null);
    setIsDropdownOpen(false);
    setEmail('');
    setPassword('');
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (!isValidEmail(email)) throw new Error('Please enter a valid email address');
      if (!selectedRole) throw new Error('Please select a role');

      // If editing, only assign role (we could also support updating email/password)
      if (editingUser?.id) {
        await assignRole.mutateAsync({ userId: editingUser.id, role: selectedRole });
        toast('success', 'Role updated');
        handleCloseModal();
        return;
      }

      // Creating
      if (password && password.trim().length >= 6) {
        await createUser.mutateAsync({ email, password, role: selectedRole });
      } else {
        await inviteUser.mutateAsync({ email, role: selectedRole });
      }
      handleCloseModal();
    } catch (err) {
      toast('error', err?.message || 'Failed to save user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) return;
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser.mutateAsync(userId);
    } catch (err) {
      // toast fired in mutation
    }
  };

  return (
    <div className="flex-1 p-6 rounded-2xl bg-gray-50 min-h-screen">
      <ScrollToTop />
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-1">Access Control</h2>
        <p className="text-gray-500 mb-6">
          Grant users access to manage parts of your account. Input the user's email and you can add a unique password for each user.
        </p>

        {/* Users */}
        <h2 className="text-xl font-semibold mb-4">Users</h2>

        {loadingUsers ? (
          <div className="p-4 text-gray-500">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-4 bg-white rounded-lg shadow-sm text-gray-500">No users found.</div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatar || 'https://placehold.co/80x80/cccccc/000000?text=U'}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://placehold.co/80x80/cccccc/000000?text=U';
                    }}
                  />
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-gray-500">{user.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors" onClick={() => openEditModal(user)} aria-label="Edit user">
                    <img src={EditIcon} alt="Edit" className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" onClick={() => handleDeleteUser(user.id)} aria-label="Delete user">
                    <img src={TrashIcon} alt="Delete" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add New User Button */}
        <div className="mt-8">
          <Button
            className="w-full rounded-2xl font-semibold py-4"
            style={{ backgroundColor: brandColor, color: contrastTextColor }}
            onClick={openCreateModal}
          >
            Add New User
          </Button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-2xl bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar shadow-lg">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center z-10">
              <h2 className="text-xl font-semibold">{editingUser ? 'Edit User' : 'Add User'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">
                <X size={24} />
              </button>
            </div>

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
                  disabled={!!editingUser}
                />

                {/* Password (optional; use to create user directly; leave blank to send invite) */}
                {!editingUser && (
                  <input
                    type="password"
                    placeholder="User Password (leave blank to send invite)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                {/* Role Dropdown */}
                <div className="relative">
                  <div
                    className="p-4 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer flex items-center justify-between"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                  >
                    <span className={selectedRole ? 'text-gray-900' : 'text-gray-500'}>
                      {selectedRole || 'Select Role'}
                    </span>
                    <span className="text-gray-500">&#9662;</span>
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-56 overflow-auto">
                      {roleNames.map((r) => (
                        <div
                          key={r}
                          onClick={() => {
                            setSelectedRole(r);
                            setIsDropdownOpen(false);
                          }}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                        >
                          {r}
                        </div>
                      ))}
                      {roleNames.length === 0 && <div className="px-4 py-2 text-gray-500">No roles available</div>}
                    </div>
                  )}
                </div>
              </div>

              {/* Role Details */}
              {selectedRole && Array.isArray(roles) && roles.length > 0 && (
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
                          {Array.isArray(role.features) && role.features.length > 0 ? (
                            role.features.map((feature) => (
                              <li key={feature} className="text-sm">
                                {feature}
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-gray-500">No features listed</li>
                          )}
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
                {editingUser ? 'Save Changes' : 'Save User'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessControl;