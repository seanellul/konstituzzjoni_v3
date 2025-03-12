import { Metadata } from 'next';

// Type definitions for Next.js pages
declare module 'next' {
  export interface PageProps {
    params?: Record<string, string>;
    searchParams?: Record<string, string | string[]>;
  }
}

export {}; 