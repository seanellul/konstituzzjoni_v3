/**
 * Utility functions for the application
 */

/**
 * Convert Arabic numeral to Roman numeral
 * @param num The Arabic numeral to convert
 * @returns The Roman numeral as a string
 */
export function toRomanNumeral(num: number): string {
  if (num < 1 || num > 3999) {
    return num.toString(); // Return original for numbers outside the range
  }

  const romanNumerals = [
    { value: 1000, numeral: 'M' },
    { value: 900, numeral: 'CM' },
    { value: 500, numeral: 'D' },
    { value: 400, numeral: 'CD' },
    { value: 100, numeral: 'C' },
    { value: 90, numeral: 'XC' },
    { value: 50, numeral: 'L' },
    { value: 40, numeral: 'XL' },
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' },
  ];

  let result = '';
  let remaining = num;

  for (const { value, numeral } of romanNumerals) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }

  return result;
}

/**
 * Safely check if code is running in a browser environment
 */
export const isBrowser = () => typeof window !== 'undefined';

/**
 * Get the base URL for API requests that works in both development and production
 */
export const getBaseUrl = () => {
  // Browser should use relative path
  if (isBrowser()) {
    return '';
  }
  
  // When rendering on the server, we need to use an absolute URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // If not in production, use localhost
  return 'http://localhost:3000';
}; 