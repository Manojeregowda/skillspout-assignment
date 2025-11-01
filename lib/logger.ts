// lib/logger.ts

/**
 * Simple logger utility to print messages with timestamps.
 * Used for debugging and tracking requests.
 */
export const log = (...args: any[]) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}]`, ...args);
};
