declare module 'next-pwa' {
  import { NextConfig } from 'next';
  
  interface PWAConfig {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    scope?: string;
    sw?: string;
    skipWaiting?: boolean;
    runtimeCaching?: Array<{
    urlPattern: RegExp | string;
    handler: string;
    options?: {
      cacheName?: string;
      expiration?: {
        maxEntries?: number;
        maxAgeSeconds?: number;
      };
      cacheableResponse?: {
        statuses?: number[];
        headers?: Record<string, string>;
      };
    };
  }>;
    publicExcludes?: string[];
    buildExcludes?: string[] | ((path: string) => boolean)[];
  }
  
  type WithPWA = (config?: PWAConfig) => (nextConfig: NextConfig) => NextConfig;
  
  const withPWA: WithPWA;
  export default withPWA;
}
