import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { X, UserPlus, Crown } from 'lucide-react';
import Button from '../ui/Button';
import ScrollToTop from '../ui/ScrollToTop';
import TrashIcon from '../../assets/icons/delete.png';

// Hooks for fetching data and performing actions
import { useAclUsersQuery } from '../../services/queries/useAccessControlQuery.js';
import {
  useAclAddUserMutation,
  useAclRemoveUserMutation,
} from '../../services/mutations/useAccessControlMutation.js';

// Utility for calculating text color based on background
import { getContrastTextColor } from '../../utils/colorUtils';

const isValidEmail = (e) => /\S+@\S+\.\S+/.test(String(e || ''));

const AccessControl = () => {
  // --- OPTIMIZATION: Get user and brand color directly from Redux state ---
  const user = useSelector((state) => state.auth.user);
  const brandColor = useMemo(() => user?.store?.brandColor || user?.store?.theme_color || '#EF4444', [user]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);
  // --- END OPTIMIZATION ---

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for the "Add User" modal
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Data fetching and mutations
  const { data: users = [], isLoading: loadingUsers } = useAclUsersQuery();
  const { mutateAsync: addUser, isLoading: isAddingUser } = useAclAddUserMutation();
  const { mutateAsync: removeUser } = useAclRemoveUserMutation();

  const openCreateModal = () => {
    setName('');
    setEmail('');
    setPassword('');
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
      }
      if (!name.trim()) {
        alert('Please enter a name');
        return;
      }
      if (password.length < 8) {
        alert('Password must be at least 8 characters');
        return;
      }

      await addUser({ name, email, password });
      handleCloseModal(); // The mutation hook will show a toast on success
    } catch (err) {
      // The mutation hook already shows a toast on error, but we can log it.
      console.error("Failed to add user:", err);
    }
  };

  const handleDeleteUser = async (userToDelete) => {
    if (!userToDelete || !userToDelete.id) return;
    if (userToDelete.is_owner) {
      alert("Cannot remove the store owner.");
      return;
    }
    if (window.confirm(`Are you sure you want to remove user ${userToDelete.name}?`)) {
      await removeUser(userToDelete.id);
    }
  };

  return (
    <div className="flex-1 p-6 rounded-2xl bg-gray-50 min-h-screen">
      <ScrollToTop />
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-1">Access Control</h2>
        <p className="text-gray-500 mb-6">
          Add or remove users who can help manage your store.
        </p>

        <h2 className="text-xl font-semibold mb-4">Store Users</h2>

        {loadingUsers ? (
          <div className="p-4 text-gray-500">Loading users...</div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    src={user.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                       <p className="font-medium">{user.name}</p>
                       {user.is_owner && <Crown size={16} className="text-yellow-500" title="Store Owner" />}
                    </div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                {!user.is_owner && (
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" onClick={() => handleDeleteUser(user)} aria-label={`Remove ${user.name}`}>
                    <img src={TrashIcon} alt="Remove" className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {users.length === 0 && <div className="p-4 bg-white rounded-lg shadow-sm text-gray-500">No users found.</div>}
          </div>
        )}

        <div className="mt-8">
          <Button
            className="w-full rounded-2xl font-semibold py-4 flex items-center justify-center gap-2"
            style={{ backgroundColor: brandColor, color: contrastTextColor }}
            onClick={openCreateModal}
          >
            <UserPlus size={20} />
            Add New User
          </Button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-lg">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add New User</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2" style={{"--tw-ring-color": brandColor}} />
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2" style={{"--tw-ring-color": brandColor}} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2" style={{"--tw-ring-color": brandColor}} />
              <Button type="submit" disabled={isAddingUser} className="w-full rounded-xl font-semibold py-3" style={{ backgroundColor: brandColor, color: contrastTextColor }}>
                {isAddingUser ? 'Adding User...' : 'Add User'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessControl;