/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ["/auth/new-verification", "/"];

/**
 * An array of routes that are used for authentication
 * @type {string[]}
 */
export const authRoutes = ["/sign-in", "/sign-up", "/auth/error", "/auth/reset", "/auth/new-password"];

/**
 * An array of routes that are used for admins only
 * @type {string[]}
 */
export const adminRoutes = ["/dashboard"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = ["/api"];

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_SIGN_IN_REDIRECT = "/dashboard/products";
export const LANDING_PAGE_REDIRECT = "/welcome";
export const DEFAULT_SIGN_OUT_REDIRECT = "/sign-in";
export const DEFAULT_AUTH_ERROR_REDIRECT = "/auth-error";
