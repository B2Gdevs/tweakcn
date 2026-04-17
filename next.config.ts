import { type NextConfig } from "next";

const nextConfig: NextConfig = {
  // TweakCN-OpenAI: skip lint during build — upstream's ESLint config
  // depends on the Next Pages plugin which isn't present with our
  // stripped setup. Lint still runs via `pnpm lint` when wanted.
  eslint: { ignoreDuringBuilds: true },
  turbopack: {
      rules: {
        '*.svg': {
          loaders: [
            {
              loader: '@svgr/webpack',
              options: {
                icon: true,
              },
            },
          ],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
