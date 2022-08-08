// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
// };

// module.exports = nextConfig;
module.exports = {
  async rewrites() {
    return [
      {
        source: `/`,
        destination: `https://adalo-notifications.herokuapp.com/`,
      },
    ];
  },
};
