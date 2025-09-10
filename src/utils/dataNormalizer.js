// src/utils/dataNormalizer.js
import profileImage from '../assets/images/profileImage.png';
import bannerImage from '../assets/images/bannerImage.png';
import promotionalBannerImage from '../assets/images/bag.png';

/* ---------------- Defaults ---------------- */
const DEFAULT_PROFILE = '/default-profile.png';
const DEFAULT_PRODUCT_IMAGE = promotionalBannerImage;

/* ---------------- Image Hydration ---------------- */
export const hydrateImage = (imagePath) => {
  if (!imagePath) return null;
  if (typeof imagePath !== 'string') return imagePath;
  if (imagePath.includes('profileImage.png')) return profileImage;
  if (imagePath.includes('bannerImage.png')) return bannerImage;
  if (imagePath.includes('bag.png')) return promotionalBannerImage;
  return imagePath;
};

/* ---------------- Safe Map Helper ---------------- */
const safeMap = (arr, fn) => (Array.isArray(arr) ? arr.map(fn) : []);

const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  let temp = obj;
  keys.slice(0, -1).forEach((k) => {
    if (!temp[k] || typeof temp[k] !== 'object') temp[k] = {};
    temp = temp[k];
  });
  temp[keys[keys.length - 1]] = value;
};

const getNestedValue = (obj, path) => path.split('.').reduce((acc, key) => acc?.[key], obj);

/* ---------------- Generic Normalizer ---------------- */
export const normalizeData = (data, { imageKeys = [], postProcess = null } = {}) => {
  if (!data) return data;

  const hydrateItem = (item) => {
    const newItem = { ...item };
    imageKeys.forEach((key) => {
      const val = getNestedValue(newItem, key);
      if (val) {
        if (Array.isArray(val)) setNestedValue(newItem, key, safeMap(val, hydrateImage));
        else setNestedValue(newItem, key, hydrateImage(val));
      }
    });
    return postProcess ? postProcess(newItem) : newItem;
  };

  if (Array.isArray(data)) return safeMap(data, hydrateItem);

  if (typeof data === 'object') {
    const normalizedObj = {};
    for (const id in data) normalizedObj[id] = hydrateItem(data[id]);
    return normalizedObj;
  }

  return data;
};

/* ---------------- Store Profile Normalizer ---------------- */
export const normalizeProfiles = (profiles) =>
  normalizeData(profiles, {
    imageKeys: ['profilePictureUrl', 'bannerImageUrl', 'promotionalBannerImageUrl'],
    postProcess: (profile) => ({
      ...profile,
      storeName: profile.storeName || profile.name || 'Guest Store',
      latestOrders: safeMap(profile.latestOrders, (order) => ({
        id: order.id || `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        customer: order.customer || 'Unknown Customer',
        itemsCount: order.itemsCount || 0,
        amount: order.amount || '$0',
      })),
      categories: Array.isArray(profile.categories) ? profile.categories : [],
      socialLinks: {
        facebook: profile.socialLinks?.facebook || '',
        twitter: profile.socialLinks?.twitter || '',
        instagram: profile.socialLinks?.instagram || '',
      },
      brandColor: profile.brandColor || '#EF4444',
      completionPercentage: profile.completionPercentage || 0,
      productsSold: profile.productsSold || 0,
      followers: profile.followers || 0,
      ratings: profile.ratings || 0,
      salesMessage: profile.salesMessage || '',
    }),
  });

/* ---------------- Products ---------------- */
export const normalizeProducts = (products) =>
  normalizeData(products, {
    imageKeys: ['imageUrl', 'detailsPageInfo.mainImageUrl', 'detailsPageInfo.thumbnailUrls', 'profile.profilePic'],
    postProcess: (p) => {
      const mainImage =
        hydrateImage(p.imageUrl) ||
        hydrateImage(p.detailsPageInfo?.mainImageUrl) ||
        DEFAULT_PRODUCT_IMAGE;

      const thumbnailUrls =
        Array.isArray(p.detailsPageInfo?.thumbnailUrls) && p.detailsPageInfo.thumbnailUrls.length
          ? p.detailsPageInfo.thumbnailUrls.map(hydrateImage)
          : [mainImage].filter(Boolean);

      return {
        ...p,

        id: p.id || p._id || `product-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: p.name || p.title || 'Unnamed Product',

        price: p.price ?? p.currentPrice ?? 0,
        currentPrice: p.currentPrice ?? p.price ?? 0,
        originalPrice: p.originalPrice ?? p.discountPrice ?? null,

        status: p.status || p.availability || 'Available',
        isSponsored: Boolean(p.isSponsored),

        metrics: {
          productViews: p.metrics?.productViews ?? p.productViews ?? 0,
          productClicks: p.metrics?.productClicks ?? p.productClicks ?? 0,
          messages: p.metrics?.messages ?? p.messages ?? 0,
          inCart: p.metrics?.inCart ?? 0,
          completedOrders: p.metrics?.completedOrders ?? 0,
          impressions: p.metrics?.impressions ?? 0,
          profileClicks: p.metrics?.profileClicks ?? 0,
          chats: p.metrics?.chats ?? 0,
          noClicks: p.metrics?.noClicks ?? 0,
          estimatedReach: p.metrics?.estimatedReach ?? 'N/A',
          estimatedProductClicks: p.metrics?.estimatedProductClicks ?? 0,
          spendingWalletBalance: p.metrics?.spendingWalletBalance ?? 0,
          ...p.metrics,
        },

        profile: {
          userName: p.profile?.userName || p.sellerName || 'Unknown',
          profilePic: hydrateImage(p.profile?.profilePic) || DEFAULT_PROFILE,
          ...p.profile,
        },

        chartData: Array.isArray(p.chartData) ? p.chartData : [],
        boostSetup: {
          dailyBudget: p.boostSetup?.dailyBudget ?? 0,
          duration: p.boostSetup?.duration ?? 0,
          selectedLocation: p.boostSetup?.selectedLocation ?? '',
          audienceSliderValue: p.boostSetup?.audienceSliderValue ?? 0,
          ...p.boostSetup,
        },

        imageUrl: mainImage,
        detailsPageInfo: {
          mainImageUrl: mainImage,
          thumbnailUrls,
          colors: Array.isArray(p.detailsPageInfo?.colors) ? p.detailsPageInfo.colors : [],
          sizes: Array.isArray(p.detailsPageInfo?.sizes) ? p.detailsPageInfo.sizes : [],
          bulkPrices: Array.isArray(p.detailsPageInfo?.bulkPrices) ? p.detailsPageInfo.bulkPrices : [],
          quantityLeft:
            p.detailsPageInfo?.quantityLeft ??
            p.stock ??
            p.quantityLeft ??
            0,
          description: p.detailsPageInfo?.description ?? p.description ?? '',
          reviews: Array.isArray(p.detailsPageInfo?.reviews) ? p.detailsPageInfo.reviews : [],
          ...p.detailsPageInfo,
        },
      };
    },
  });

/* ---------------- Promotions ---------------- */
export const normalizePromotions = (promos) =>
  normalizeData(promos, {
    imageKeys: ['imageUrl', 'detailsPageInfo.mainImageUrl', 'detailsPageInfo.thumbnailUrls', 'profile.profilePic'],
    postProcess: (raw) => {
      const prod = normalizeProducts([raw])[0] || {};
      const pd = raw.promotionDetails || {};
      const safeNum = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);

      let daysRemaining = safeNum(pd.daysRemaining, 0);
      if (pd.endDate) {
        const ms = new Date(pd.endDate).getTime() - Date.now();
        const d = Math.ceil(ms / (1000 * 60 * 60 * 24));
        if (Number.isFinite(d)) daysRemaining = Math.max(0, d);
      }

      return {
        ...prod,
        id: raw.id || prod.id || `promo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        ownerId: raw.ownerId || prod.ownerId || null,
        isSponsored: true,
        promotionDetails: {
          reach: safeNum(pd.reach, 0),
          impressions: safeNum(pd.impressions, 0),
          costPerClick: safeNum(pd.costPerClick, 0),
          amountSpent: safeNum(pd.amountSpent, 0),
          dateCreated: pd.dateCreated || new Date().toISOString(),
          endDate: pd.endDate || '',
          daysRemaining,
          status: pd.status || 'Active',
        },
      };
    },
  });

/* ---------------- Services ---------------- */
export const normalizeServices = (services) =>
  normalizeData(services, {
    imageKeys: ['imageUrl', 'profilePic', 'gallery', 'images'],
    postProcess: (service) => ({
      ...service,
      id: service.id || `service-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: service.name || service.title || 'Untitled Service',
      description: service.description || '',
      price: service.price ?? 0,
      rating: service.rating ?? 0,
      category: service.category || '',
      isActive: service.isActive ?? true,
    }),
  });

/* ---------------- Orders ---------------- */
export const normalizeOrders = (orders) =>
  normalizeData(orders, {
    imageKeys: ['items.imageUrl'],
  });

/* ---------------- Chats (generic) ---------------- */
export const normalizeChats = (chats) =>
  normalizeData(chats, {
    imageKeys: ['userProfilePic', 'messages.payload.items.image'],
    postProcess: (chat) => ({
      ...chat,
      messages: (Array.isArray(chat.messages) ? chat.messages : []).map((msg) => ({
        ...msg,
        payload: {
          ...msg.payload,
          items: (msg.payload?.items || []).map((item) => ({
            ...item,
            image: hydrateImage(item.image),
          })),
          url: hydrateImage(msg.payload?.url),
        },
      })),
    }),
  });

/* ---------------- Feed Posts ---------------- */
export const normalizeFeedPosts = (posts) =>
  normalizeData(posts, {
    imageKeys: ['userProfilePic', 'imageUrl'],
    postProcess: (post) => ({
      id: post.id || `temp-post-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userName: post.userName || 'Unknown',
      userProfilePic: hydrateImage(post.userProfilePic),
      text: post.text || '',
      imageUrl: hydrateImage(post.imageUrl),
      likes: post.likes || 0,
      comments: post.comments || 0,
      shares: post.shares || 0,
      commentsList: (Array.isArray(post.commentsList) ? post.commentsList : []).map((comment) => ({
        id: comment.id || `temp-comment-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userName: comment.userName || 'Unknown',
        userProfilePic: hydrateImage(comment.userProfilePic),
        text: comment.text || '',
        likes: comment.likes || 0,
        createdAt: comment.createdAt || new Date().toISOString(),
      })),
      createdAt: post.createdAt || new Date().toISOString(),
      ...post,
    }),
  });

/* ---------------- Store Analytics ---------------- */
export const normalizeAnalytics = (analytics) =>
  normalizeData(analytics, {
    postProcess: (data) => ({
      totalSales: data.totalSales ?? 0,
      totalOrders: data.totalOrders ?? 0,
      totalCustomers: data.totalCustomers ?? 0,
      revenue: data.revenue ?? 0,
      conversionRate: data.conversionRate ?? 0,
      topProducts: Array.isArray(data.topProducts) ? data.topProducts : [],
      recentActivity: Array.isArray(data.recentActivity) ? data.recentActivity : [],
    }),
  });

/* ---------------- Chats Thread (for useChatsQuery) ---------------- */
export const normalizeChatThread = (data) => {
  const raw = data?.chats ?? data;
  const arr = Array.isArray(raw) ? raw : raw && typeof raw === 'object' ? Object.values(raw) : [];

  return arr.map((chat) => {
    const messages = Array.isArray(chat.messages) ? chat.messages : [];
    const lastMsg = messages[messages.length - 1];

    return {
      id: chat.id || chat._id || `chat-${Math.random().toString(36).slice(2, 9)}`,
      userName: chat.userName || chat.name || 'Unknown',
      userProfilePic: hydrateImage(chat.userProfilePic),
      lastMessage: chat.lastMessage || lastMsg?.text || '',
      time:
        chat.time ||
        (chat.updatedAt ? new Date(chat.updatedAt).toLocaleTimeString() : lastMsg?.createdAt || ''),
      unreadCount: chat.unreadCount || 0,
      messages: messages.map((m) => ({
        ...m,
        payload: {
          ...m.payload,
          url: hydrateImage(m.payload?.url),
          items: (m.payload?.items || []).map((item) => ({
            ...item,
            image: hydrateImage(item.image),
          })),
        },
      })),
    };
  });
};

/* ---------------- Coupons ---------------- */
export const normalizeCoupons = (coupons) =>
  normalizeData(coupons, {
    imageKeys: [],
    postProcess: (c) => ({
      id: c.id || `coupon-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      code: c.code || '',
      dateCreated: c.dateCreated || new Date().toISOString(),
      timesUsed: Number.isFinite(c.timesUsed) ? c.timesUsed : 0,
      maxUsage: Number.isFinite(c.maxUsage) ? c.maxUsage : 0,
      percentageOff: Number.isFinite(c.percentageOff) ? c.percentageOff : 0,
      usagePerUser: Number.isFinite(c.usagePerUser) ? c.usagePerUser : 1,
      expiryDate: c.expiryDate || '',
      ...c,
    }),
  });

/* ---------------- Customer Points ---------------- */
export const normalizeCustomerPoints = (rows) =>
  normalizeData(rows, {
    imageKeys: ['avatarUrl', 'avatar', 'profilePic'],
    postProcess: (r) => {
      const points =
        Number.isFinite(r.points) ? Number(r.points) :
          Number.isFinite(r.pointsBalance) ? Number(r.pointsBalance) :
            0;

      const earned =
        Number.isFinite(r.totalEarned) ? Number(r.totalEarned) :
          Number.isFinite(r.earned) ? Number(r.earned) : 0;

      const redeemed =
        Number.isFinite(r.totalRedeemed) ? Number(r.totalRedeemed) :
          Number.isFinite(r.redeemed) ? Number(r.redeemed) : 0;

      return {
        id: r.id || r.customerId || r.userId || `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        customerId: r.customerId || r.id || r.userId || null,
        name: r.name || r.fullName || r.username || 'Unknown Customer',
        email: r.email || '',
        avatarUrl: hydrateImage(r.avatarUrl || r.avatar || r.profilePic) || DEFAULT_PROFILE,
        points,
        pointsBalance: points,
        totalEarned: earned,
        totalRedeemed: redeemed,
        lastUpdated: r.lastUpdated || r.updated_at || r.updatedAt || r.createdAt || '',
        tier: r.tier || r.level || null,
        ...r,
      };
    },
  });

/* ---------------- Reviews: Store ---------------- */
export const normalizeStoreReviews = (reviews) =>
  normalizeData(reviews, {
    imageKeys: ['reviewerAvatar'],
    postProcess: (r) => ({
      id: r.id || `sr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      reviewerName: r.reviewerName || 'Anonymous',
      reviewerAvatar: hydrateImage(r.reviewerAvatar),
      rating: Number.isFinite(Number(r.rating)) ? Math.max(0, Math.min(5, Number(r.rating))) : 0,
      reviewText: r.reviewText || '',
      dateCreated: r.dateCreated || r.created_at || r.createdAt || new Date().toISOString(),
      storeId: r.storeId || r.store_id || null,
      type: 'store',
      ...r,
    }),
  });

/* ---------------- Reviews: Product ---------------- */
export const normalizeProductReviews = (reviews) =>
  normalizeData(reviews, {
    imageKeys: ['reviewerAvatar', 'productImages'],
    postProcess: (r) => ({
      id: r.id || `pr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      reviewerName: r.reviewerName || 'Anonymous',
      reviewerAvatar: hydrateImage(r.reviewerAvatar),
      rating: Number.isFinite(Number(r.rating)) ? Math.max(0, Math.min(5, Number(r.rating))) : 0,
      reviewText: r.reviewText || '',
      dateCreated: r.dateCreated || r.created_at || r.createdAt || new Date().toISOString(),
      productImages: Array.isArray(r.productImages) ? r.productImages.map(hydrateImage) : [],
      productId: r.productId || r.product_id || null,
      type: 'product',
      ...r,
    }),
  });

/* ---------------- Referrals: Wallet ---------------- */

export const normalizeReferralWallet = (data) => {
  // Accept object or [object]; otherwise default to {}
  const w = Array.isArray(data)
    ? data[0] || {}
    : data && typeof data === 'object'
      ? data
      : {};

  return {
    totalEarnings: Number(
      w.totalEarnings ?? w.total_earnings ?? w.total ?? 0
    ),
    totalReferrals: Number(
      w.totalReferrals ?? w.total_referrals ?? w.referrals ?? 0
    ),
    referralCode: String(w.referralCode ?? w.code ?? ''),
    currency: w.currency || '₦',
    availableBalance: Number(
      w.availableBalance ?? w.available_balance ?? w.balance ?? 0
    ),
  };
};
/* ---------------- Referrals: Transactions ---------------- */
export const normalizeReferralTransactions = (rows) =>
  normalizeData(rows, {
    postProcess: (r) => ({
      id: r.id || `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: r.type || 'earning', // earning | withdrawal | transfer
      amount: Number(r.amount) || 0,
      date: r.date || r.created_at || r.createdAt || new Date().toISOString(),
      note: r.note || '',
      ...r,
    }),
  });

/* ---------------- Referrals: Products ---------------- */
export const normalizeReferralProducts = (rows) =>
  normalizeData(rows, {
    imageKeys: ['imageUrl', 'storeAvatar'],
    postProcess: (r) => ({
      id: r.id || `ref-prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: r.name || 'Unnamed Product',
      price: Number(r.price) || 0,
      commission: r.commission || '0%',
      store: r.store || 'Unknown Store',
      storeAvatar: hydrateImage(r.storeAvatar),
      imageUrl: hydrateImage(r.imageUrl),
      ...r,
    }),
  });

/* ---------------- Referrals: FAQs ---------------- */
export const normalizeReferralFaqs = (data) => {
  const safe = {
    videoUrl: data?.videoUrl || '',
    thumbnail: data?.thumbnail || '',
    items: Array.isArray(data?.items) ? data.items : [],
  };
  return safe;
};

/* ---------------- Leaderboard Sellers ---------------- */
export const normalizeLeaderboardSellers = (rows) =>
  normalizeData(rows, {
    imageKeys: ['avatarUrl'],
    postProcess: (r) => ({
      id: r.id || `lb-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: r.name || r.storeName || 'Unknown Store',
      score: Number(r.score ?? r.points ?? 0),
      avatarUrl: hydrateImage(r.avatarUrl || r.avatar || ''),
      ...r,
    }),
  });

/* ---------------- Leaderboard FAQs ---------------- */
export const normalizeLeaderboardFaqs = (rows) => {
  const arr = Array.isArray(rows) ? rows : [];
  return arr.map((r) => ({
    name: r.name || r.role || 'Role',
    features: Array.isArray(r.features) ? r.features : [],
  }));
};

/* ---------------- Access Control: Users ---------------- */
export const normalizeAclUsers = (rows) =>
  normalizeData(rows, {
    imageKeys: ['avatar'],
    postProcess: (u) => ({
      id: u.id || `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      email: String(u.email || '').toLowerCase(),
      role: u.role || u.roleName || 'Viewer',
      avatar: hydrateImage(u.avatar || ''),
      createdAt: u.createdAt || u.created_at || new Date().toISOString(),
      ...u,
    }),
  });

/* ---------------- Access Control: Roles ---------------- */
export const normalizeAclRoles = (rows) => {
  const arr = Array.isArray(rows) ? rows : [];
  return arr.map((f, i) => ({
    question: f.question || `Question ${i + 1}`,
    answer: f.answer || '',
  }));
};

/* ---------------- Announcements ---------------- */
export const normalizeAnnouncements = (rows) =>
  normalizeData(rows, {
    // Hydrate common image fields
    imageKeys: ['imageUrl', 'image', 'thumbnail', 'icon'],
    postProcess: (r) => {
      // Prefer explicit image, fallback to hydrated banner
      const hydrated =
        hydrateImage(r.imageUrl || r.image || r.thumbnail || r.icon) || bannerImage;

      return {
        id: r.id || r._id || `ann-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: r.title || r.heading || 'Untitled',
        message: r.message || r.text || r.body || '',
        imageUrl: hydrated,
        linkUrl: r.linkUrl || r.url || r.ctaUrl || '',
        isActive: typeof r.isActive === 'boolean' ? r.isActive : (r.active ?? true),
        pinned: Boolean(r.pinned),
        priority: Number.isFinite(Number(r.priority)) ? Number(r.priority) : 0,
        dateCreated: r.dateCreated || r.created_at || r.createdAt || new Date().toISOString(),
        startDate: r.startDate || r.starts_at || r.startsAt || '',
        endDate: r.endDate || r.ends_at || r.endsAt || '',
        type: 'announcement',
        ...r,
      };
    },
  });

/* ---------------- Banners ---------------- */
export const normalizeBanners = (rows) =>
  normalizeData(rows, {
    imageKeys: ['imageUrl', 'image', 'thumbnail'],
    postProcess: (r) => {
      const hydrated =
        hydrateImage(r.imageUrl || r.image || r.thumbnail) || bannerImage;

      return {
        id: r.id || r._id || `ban-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: r.title || r.name || 'Banner',
        subtitle: r.subtitle || r.caption || '',
        imageUrl: hydrated,
        linkUrl: r.linkUrl || r.url || r.ctaUrl || '',
        position: r.position || r.placement || 'top', // e.g., 'top' | 'bottom' | 'sidebar'
        isActive: typeof r.isActive === 'boolean' ? r.isActive : (r.active ?? true),
        dateCreated: r.dateCreated || r.created_at || r.createdAt || new Date().toISOString(),
        startDate: r.startDate || r.starts_at || r.startsAt || '',
        endDate: r.endDate || r.ends_at || r.endsAt || '',
        type: 'banner',
        ...r,
      };
    },
  });