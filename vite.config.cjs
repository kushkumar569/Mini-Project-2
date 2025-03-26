const { defineConfig, loadEnv } = require('vite');
const react = require('@vitejs/plugin-react');
const { VitePWA } = require('vite-plugin-pwa');

async function getConfig(mode) {
  const tailwindcss = (await import('@tailwindcss/vite')).default;

  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    define:{
      'process.env.BACKEND_URL':JSON.stringify(env.BACKEND_URL),
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "prompt",
        includeAssets: ['logo.png', 'logo.svg'],
        manifest: {
          name: 'Geofancing Attendence Manager',
          short_name: 'GAM app',
          description: 'My awesome Geo-fencing Attendence Manager application!',
          theme_color: '#ffffff',
          icons: [
            {
              src: "/logo.png",
              sizes: "192x192",
              type: "image/png"
            },
            {
              src: "/logo.png",
              sizes: "512x512",
              type: "image/png"
            },
            {
              src: "/logo.png",
              sizes: "180x180",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "/logo.png",
              sizes: "144x144",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "/logo.png",
              sizes: "256x256",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "/logo.png",
              sizes: "384x384",
              type: "image/png",
              purpose: "any maskable"
            },
            {
              src: "/logo.svg",
              type: "image/svg+xml",
              purpose: "any"
            }
          ]
        }
      })
    ]
  });
}

module.exports = getConfig();
