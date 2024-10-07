/** @type {import('next').NextConfig} */
// const nextConfig = {};

// module.exports = nextConfig;
module.exports = {
  async rewrites() {
    return [
      // {
      //   source: "/api/generate",
      //   destination: "http://localhost:11434/api/generate",
      // },
    ];
  },
};
