"use client"

/**
 * Helper functions for working with URLs in the application
 */

/**
 * Constructs a frontend URL by either using the NEXT_PUBLIC_FRONTEND_URL
 * environment variable or falling back to a relative path.
 * 
 * @param path The path to append to the frontend URL (should start with '/')
 * @returns The complete frontend URL
 */
export function getFrontendUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || '';
  return `${baseUrl}${path}`;
}

/**
 * Constructs a backend API URL using the NEXT_PUBLIC_API_URL environment
 * variable or falling back to a default value.
 * 
 * @param path The API path to append (should start with '/')
 * @returns The complete API URL
 */
export function getApiUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://tiffin-backend-tvjj.onrender.com';
  return `${baseUrl}${path}`;
}

/**
 * Redirects to a frontend URL by constructing the URL using the 
 * NEXT_PUBLIC_FRONTEND_URL environment variable if available.
 * 
 * @param path The path to redirect to (should start with '/')
 */
export function redirectToFrontendUrl(path: string): void {
  window.location.href = getFrontendUrl(path);
}
