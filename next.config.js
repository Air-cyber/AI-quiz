/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      appDir: true, // Ensures Next.js uses the "app" directory instead of "pages"
    },
    reactStrictMode: true, // Enables strict mode for catching errors early
    distDir: "build", // (Optional) Changes the output directory if needed
    compiler: {
      styledComponents: true, // Enables better styling if using styled-components
    },
  };
  
  module.exports = nextConfig;
  
