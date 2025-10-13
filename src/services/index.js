// src/services/index.js

/**
 * This file acts as a central hub ("barrel file") for exporting all application services.
 * It provides a single, consistent path for other modules (like React Query hooks or components)
 * to import any service they need.
 *
 * All dummy data and conditional logic have been removed for production.
 */

// --- Main Application Services ---
export * from './userService.js';
export * from './productService.js';
export * from './serviceService.js';
export * from './chatService.js';
export * from './feedService.js';
export * from './orderService.js';

// --- Settings & Sub-feature Services ---
export * from './settings/reviewService.js';
export * from './settings/referralService.js';
export * from './settings/supportService.js';
export * from './settings/leaderboardService.js';
export * from './settings/accessControlService.js';
export * from './settings/storeAnalyticsService.js';
export * from './settings/promotionsService.js';
export * from './settings/announcementService.js';
export * from './settings/couponService.js';