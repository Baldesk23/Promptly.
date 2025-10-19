/** @type {import('next').NextConfig} */
const ContentSecurityPolicy = "
default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.gstatic.com https://www.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; connect-src 'self' https://identitytoolkit.googleapis.com https://firestore.googleapis.com https://firebasestorage.googleapis.com https://firebaserules.googleapis.com; font-src https://fonts.gstatic.com; frame-src https://accounts.google.com;
"

const securityHeaders = [
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Permissions-Policy', value: 'geolocation=(), microphone=()' },
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy.replace(/\n/g, ' ') },
]

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'lh3.googleusercontent.com', 'firebasestorage.googleapis.com'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
