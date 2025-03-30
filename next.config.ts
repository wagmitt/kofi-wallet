import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'popup=*; camera=*; microphone=()', // Allow popups from any origin
          }
        ]
      }
    ];
  }
};

export default nextConfig;
