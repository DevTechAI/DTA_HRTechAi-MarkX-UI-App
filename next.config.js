/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure App Router is being used (this is default in Next.js 13+)
  // Disable Pages Router completely
  skipTrailingSlashRedirect: true,
  experimental: {
    // This improves App Router performance
    serverMinification: true,
  }
}

module.exports = nextConfig
