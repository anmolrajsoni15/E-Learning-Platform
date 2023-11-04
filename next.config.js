/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["digitalpress.fra1.cdn.digitaloceanspaces.com", "api.uifaces.co", "randomuser.me", "images.unsplash.com", "static.ghost.org", "www.gravatar.com", "localhost","lh3.googleusercontent.com"],
        remotePatterns: [
          {
            protocol: "http",
            hostname: "**",
          },
          {
            protocol: "https",
            hostname: "**",
          },
        ]
      },
}

module.exports = nextConfig
