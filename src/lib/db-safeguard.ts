/**
 * Database Security Safeguard
 * 
 * This module helps prevent accidental exposure of database tools in production.
 */

/**
 * Checks if the environment is safe for exposing database admin tools
 * @returns boolean indicating if the environment is safe
 */
export function isSafeEnvironment(): boolean {
  // Only allow database tools in development
  return process.env.NODE_ENV === 'development';
}

/**
 * Verifies that the current environment is safe for database operations
 * @param allowProduction override to allow in production (USE WITH CAUTION)
 * @returns void, but throws error if unsafe
 */
export function verifyEnvironment(allowProduction = false): void {
  if (!isSafeEnvironment() && !allowProduction) {
    throw new Error('SECURITY RISK: Attempted to use database admin tools in production environment');
  }
}

/**
 * Gets hostname binding for database tools
 * @returns hostname to bind to ('localhost' in dev, nothing in production)
 */
export function getSafeHostname(): string {
  // In development, only bind to localhost
  // In production, this will be empty and shouldn't be used
  return isSafeEnvironment() ? 'localhost' : '';
} 