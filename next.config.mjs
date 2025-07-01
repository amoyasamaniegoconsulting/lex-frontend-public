import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
   webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    if (cfg.cache && !dev) {
      cfg.cache = Object.freeze({
        type: 'memory',
      })
      cfg.cache.maxMemoryGenerations = 0
    }
    // Important: return the modified config
    return config
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Puedes poner más si lo necesitas
    },
    serverComponentsExternalPackages: ["@smithy", "util-stream"],
  },
  rewrites: async () => {
    return [
      {
        source: "/api/v1/py/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/v1/py/:path*"
            : "/api/v1/py",
      },
      {
        source: "/docs",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/v1/py/docs"
            : "/api/py/docs",
      },
      {
        source: "/openapi.json",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/v1/py/openapi.json"
            : "/api/py/openapi.json",
      },
    ];
  },
};

export default withNextIntl(nextConfig);
