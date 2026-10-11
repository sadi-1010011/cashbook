/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});
 
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.29.50'],
}
   
module.exports = withPWA(nextConfig);