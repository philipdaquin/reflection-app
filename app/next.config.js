/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'www.telegraph.co.uk',
      'unsplash.com',
      'images.unsplash.com',
      'cdn.discordapp.com'
    ],
  },
  env: { 
    apiKey: process.env.APIKEY
  }
}
