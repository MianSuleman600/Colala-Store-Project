import React, { useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Loader2, Heart, MessageCircle, Share, MoreVertical, Download } from "lucide-react";

import Modal from "../ui/Modal";
import Button from "../ui/Button";
import PromotionalBanner from "../ui/PromotionBanner";
import { getContrastTextColor } from "../../utils/colorUtils";
import { openModal } from "../../redux/modalSlice";

import StoreHeader from "../store/StoreHeader";
import StoreOwnerInfoSection from "../store/StoreOwnerInfoSection";
import StoreTabs from "../store/StoreTabs";
import ProductFilterControls from "../ui/ProductFilterControls";
import ProductDisplayCard from "../products/ProductDisplayCard";
import StoreReviewsTab from "../reviews/StoreReviewsTab";

import { useStoreProfile } from "../../services/queries/storeProfileQuery";
import {
  useCreateCommentMutation,
  useLikePostMutation,
  useSharePostMutation,
} from "../../services/mutations/useFeedMutation";
import CommentsModal from "../Feed/CommentsModal";
import { useToast } from "../ui/ToastProvider";

function StoreProfileModal({ isOpen, onClose, storeId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { push } = useToast();

  const { isAuthenticated: isLoggedIn, user } = useSelector(
    (state) => state.auth
  );
  const userId = user?.id;

  const [activeTab, setActiveTab] = useState("Products");
  const [isFollowing, setIsFollowing] = useState(false);
  const [filters, setFilters] = useState({ search: "", sort: "none" });
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [postShares, setPostShares] = useState(new Map());
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState(null);

  // The hook now returns clean, normalized data
  const {
    data: storeProfile,
    isLoading: profileLoading,
    error: profileError,
  } = useStoreProfile(storeId, {
    enabled: isOpen && !!storeId,
  });

  const brandColor = useMemo(
    () => storeProfile?.brandColor || "#EF4444",
    [storeProfile]
  );
  const contrastTextColor = useMemo(
    () => getContrastTextColor(brandColor),
    [brandColor]
  );
  const isStoreOwner = useMemo(
    () => isLoggedIn && userId === storeProfile?.ownerId,
    [isLoggedIn, userId, storeProfile]
  );

  // Extract data directly from store profile response
  const products = useMemo(() => storeProfile?.products || [], [storeProfile]);
  const feedPosts = useMemo(() => storeProfile?.posts || [], [storeProfile]);
  const storeReviews = useMemo(
    () => storeProfile?.storeReveiws || [],
    [storeProfile]
  );

  // Feed mutations
  const createCommentMutation = useCreateCommentMutation({
    onSuccess: () => push("Comment added successfully!"),
    onError: (e) => push(e.data?.message || "Failed to add comment", { type: "error" })
  });
  const likePostMutation = useLikePostMutation({
    onError: (e) => push(e.data?.message || "Failed to like post", { type: "error" })
  });
  const sharePostMutation = useSharePostMutation({
    onSuccess: () => push("Post link copied to clipboard!"),
    onError: (e) => push(e.data?.message || "Failed to share post", { type: "error" })
  });

  const handleFollowToggle = () => {
    if (!isLoggedIn) {
      dispatch(openModal("login"));
      return;
    }
    setIsFollowing((prev) => !prev);
  };

  const handleShare = () => {
    navigator.share?.({ title: storeProfile?.name, url: window.location.href });
  };

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleLikePost = useCallback((postId) => {
    if (!isLoggedIn) {
      dispatch(openModal("login"));
      return;
    }
    likePostMutation.mutate(postId);
    // Update local state for immediate UI feedback
    setLikedPosts((prev) => {
      const newLikedPosts = new Set(prev);
      if (newLikedPosts.has(postId)) {
        newLikedPosts.delete(postId);
      } else {
        newLikedPosts.add(postId);
      }
      return newLikedPosts;
    });
  }, [isLoggedIn, dispatch, likePostMutation]);

  const handleSharePost = useCallback((postId) => {
    if (!isLoggedIn) {
      dispatch(openModal("login"));
      return;
    }
    sharePostMutation.mutate(postId);
    // Update local state for immediate UI feedback
    setPostShares((prev) => {
      const newShares = new Map(prev);
      const currentShares = newShares.get(postId) || 0;
      newShares.set(postId, currentShares + 1);
      return newShares;
    });
  }, [isLoggedIn, dispatch, sharePostMutation]);

  const handleDownloadPost = useCallback((postId) => {
    // Implement download functionality
    console.log("Downloading post:", postId);
  }, []);

  const handleCommentClick = useCallback((post) => {
    if (!isLoggedIn) {
      dispatch(openModal("login"));
      return;
    }
    setSelectedPostForComments(post);
    setShowCommentsModal(true);
  }, [isLoggedIn, dispatch]);

  const handleAddComment = useCallback((postId, commentText) => {
    createCommentMutation.mutate({ postId, body: commentText });
  }, [createCommentMutation]);

  const formatTimeAgo = useCallback((dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`;
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (filters.search) {
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    return result;
  }, [products, filters]);

  if (!isOpen) return null;
  if (profileLoading)
    return (
      <Modal isOpen={true} onClose={onClose} title="Loading...">
        <div className="p-8 text-center">Loading Store...</div>
      </Modal>
    );
  if (profileError || !storeProfile)
    return (
      <Modal isOpen={true} onClose={onClose} title="Error">
        <div className="p-8 text-center text-red-500">
          {profileError?.message || "Store not found."}
        </div>
      </Modal>
    );

  const ProductsGrid = () => {
    if (profileLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading products...</span>
          </div>
        </div>
      );
    }

    if (filteredProducts.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <PlusCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm">
              {filters.search
                ? "Try adjusting your search terms"
                : "This store hasn't added any products yet"}
            </p>
          </div>
          {isStoreOwner && (
            <Button
              onClick={() => navigate("/seller-dashboard/products")}
              className="mt-4"
              style={{ backgroundColor: brandColor, color: contrastTextColor }}
            >
              Add Your First Product
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          // Find the main image
          const mainImage =
            product.images?.find((img) => img.is_main === 1) ||
            product.images?.[0];
          const imageUrl = mainImage
            ? `${
                import.meta.env.VITE_API_URL || "https://colala.hmstech.xyz"
              }/storage/${mainImage.path}`
            : null;


          const handleProductClick = () => {
            navigate(`/my-products/${product.id}/details`, {
              state: { product }
            });
          };

          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow:lg hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
              onClick={handleProductClick}
            >
              {/* Sponsored Badge */}
              <div className="relative">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}{" "}
              </div>

              <div className="p-2">
                {/* Store Information */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex  justify-center">
                    {storeProfile?.storeOwner?.profilePicture ? (
                      <img
                        src={storeProfile.storeOwner.profilePicture}
                        alt={storeProfile?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {storeProfile?.name?.charAt(0) || "S"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {storeProfile?.name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400 text-sm">★</span>
                    <span className="text-sm text-gray-600">
                      {storeProfile?.averageRating || "4.5"}
                    </span>
                  </div>
                </div>

                {/* Product Name */}
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                  {product.name}
                </h3>

                {/* Pricing */}
                <div className="flex items-center space-x-2 mb-3">
                  <span
                    className="text-lg font-bold"
                    style={{ color: brandColor }}
                  >
                    ₦
                    {parseFloat(
                      product.discount_price || product.price
                    ).toLocaleString()}
                  </span>
                  {product.discount_price && (
                    <span className="text-xs text-gray-500 line-through">
                      ₦{parseFloat(product.price).toLocaleString()}
                    </span>
                  )}
                </div>
                {/* Location and Add to Cart Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500 text-xs">📍</span>
                    <span className="text-xs text-gray-600">
                      {storeProfile?.location || "Lagos, Nigeria"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  const FeedPreview = () => {
    if (profileLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading posts...</span>
          </div>
        </div>
      );
    }

    if (feedPosts.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <PlusCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium">No posts yet</p>
            <p className="text-sm">
              {isStoreOwner
                ? "Share updates about your store and products"
                : "This store hasn't shared any posts yet"}
            </p>
          </div>
          {isStoreOwner && (
            <Button
              onClick={() => navigate("/seller-dashboard/feed")}
              className="mt-4"
              style={{ backgroundColor: brandColor, color: contrastTextColor }}
            >
              Create Your First Post
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {feedPosts.map((post) => {
          const isLiked = likedPosts.has(post.id);
          const currentShares = postShares.get(post.id) || 0;
          const totalLikes = post.likes_count + (isLiked ? 1 : 0);
          const totalShares = post.shares_count + currentShares;

          return (
            <div key={post.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Header Section */}
              <div className="flex items-center justify-between p-4 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    {storeProfile?.storeOwner?.profilePicture ? (
                      <img
                        src={storeProfile.storeOwner.profilePicture}
                        alt={storeProfile?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {storeProfile?.name?.charAt(0) || "S"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {storeProfile?.name}
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <span>{storeProfile?.location || "Lagos, Nigeria"}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(post.created_at)}</span>
                    </div>
                  </div>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded-full">
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-3">
                <p className="text-gray-800 text-sm leading-relaxed mb-3">
                  {post.body}
                </p>
              </div>

              {/* Media Section */}
              {post.media_urls && post.media_urls.length > 0 && (
                <div className="px-4 pb-3">
                  {post.media_urls.length === 1 ? (
                    <img
                      src={`${
                        import.meta.env.VITE_API_URL ||
                        "https://colala.hmstech.xyz"
                      }${post.media_urls[0].url}`}
                      alt="Post media"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {post.media_urls.map((media, index) => (
                        <img
                          key={index}
                          src={`${
                            import.meta.env.VITE_API_URL ||
                            "https://colala.hmstech.xyz"
                          }${media.url}`}
                          alt={`Post media ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Engagement Section */}
              <div className="px-4 py-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      disabled={likePostMutation.isLoading}
                      className={`flex items-center space-x-1 ${
                        isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                      } transition-colors ${likePostMutation.isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                      <span className="text-sm font-medium">{totalLikes}</span>
                    </button>
                    <button 
                      onClick={() => handleCommentClick(post)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">{post.comments_count}</span>
                    </button>
                    <button
                      onClick={() => handleSharePost(post.id)}
                      disabled={sharePostMutation.isLoading}
                      className={`flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors ${sharePostMutation.isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <Share className="h-5 w-5" />
                      <span className="text-sm font-medium">{totalShares}</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!isStoreOwner && (
                      <button
                        className="px-4 py-2 rounded-full text-white text-sm font-medium transition-colors"
                        style={{ backgroundColor: brandColor }}
                        onClick={handleFollowToggle}
                      >
                        Follow Store
                      </button>
                    )}
                    <button
                      onClick={() => handleDownloadPost(post.id)}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  const ReviewsList = () => {
    if (profileLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading reviews...</span>
          </div>
        </div>
      );
    }

    if (storeReviews.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <PlusCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium">No reviews yet</p>
            <p className="text-sm">
              {isStoreOwner
                ? "Reviews will appear here when customers rate your store"
                : "This store hasn't received any reviews yet"}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {storeReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg border p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {review.user?.full_name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-gray-900">
                    {review.user?.full_name}
                  </h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{review.comment}</p>
                {review.images && review.images.length > 0 && (
                  <div className="flex space-x-2">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={`${
                          import.meta.env.VITE_API_URL ||
                          "https://colala.hmstech.xyz"
                        }/storage/${image}`}
                        alt={`Review image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const modalContent = (
    <div className="grid grid-cols-1 mt-3 lg:grid-cols-3 px-6 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <StoreHeader
          bannerImageUrl={storeProfile.bannerImageUrl}
          profilePictureUrl={storeProfile.profilePictureUrl}
          isModalOpen={isOpen}
          handleGoBack={onClose}
          handleShare={handleShare}
          isFollowing={isFollowing}
          handleFollowToggle={handleFollowToggle}
          isStoreOwner={isStoreOwner}
        />
        <StoreOwnerInfoSection
          storeData={storeProfile}
          isLoggedIn={isLoggedIn}
          isStoreOwner={isStoreOwner}
          brandColor={brandColor}
          contrastTextColor={contrastTextColor}
        />
        <PromotionalBanner placement="profile" />
      </div>
      <div className="lg:col-span-2 space-y-6">
        <StoreTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          brandColor={brandColor}
          contrastTextColor={contrastTextColor}
        />
        {activeTab === "Products" && (
          <>
            <ProductFilterControls
              value={filters}
              onChange={handleFilterChange}
            />
            <ProductsGrid />
          </>
        )}
        {activeTab === "SocialFeed" && <FeedPreview />}
        {activeTab === "Reviews" && <ReviewsList />}
      </div>
    </div>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="w-11/12 max-w-6xl"
        title=""
      >
        {modalContent}
      </Modal>

      {/* Comments Modal */}
      {showCommentsModal && selectedPostForComments && (
        <CommentsModal
          isOpen={showCommentsModal}
          onClose={() => setShowCommentsModal(false)}
          post={selectedPostForComments}
          onAddComment={handleAddComment}
          isCommenting={createCommentMutation.isLoading}
          brandColor={brandColor}
          contrastColor={contrastTextColor}
          currentUserProfilePic={user?.store?.profile_image ? `${import.meta.env.VITE_API_URL || 'https://colala.hmstech.xyz'}/storage/${user.store.profile_image}` : '/default-profile.png'}
          isAuthenticated={isLoggedIn}
        />
      )}
    </>
  );
}

export default StoreProfileModal;
