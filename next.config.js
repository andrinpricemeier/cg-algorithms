const withDeps = require('next-transpile-modules')(['@mui/material/styles']);

/** @type {import('next').NextConfig} */
const nextConfig = withDeps({
  reactStrictMode: true,
});

module.exports = nextConfig
