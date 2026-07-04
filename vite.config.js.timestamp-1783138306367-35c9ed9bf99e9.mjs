// vite.config.js
import { defineConfig } from "file:///sessions/gifted-great-heisenberg/mnt/Virtual%20Volunteer/elliss/node_modules/vite/dist/node/index.js";
import react from "file:///sessions/gifted-great-heisenberg/mnt/Virtual%20Volunteer/elliss/node_modules/@vitejs/plugin-react/dist/index.js";
import { VitePWA } from "file:///sessions/gifted-great-heisenberg/mnt/Virtual%20Volunteer/elliss/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "favicon-16x16.png", "favicon-32x32.png", "apple-touch-icon.png", "icon-192x192.png", "icon-512x512.png"],
      manifest: {
        name: "Elliss",
        short_name: "Elliss",
        description: "Kind Hearts. Better Lives.",
        start_url: "/",
        display: "standalone",
        background_color: "#faf8f5",
        theme_color: "#324a7d",
        icons: [
          { src: "/icon-72x72.png", sizes: "72x72", type: "image/png", purpose: "any" },
          { src: "/icon-96x96.png", sizes: "96x96", type: "image/png", purpose: "any" },
          { src: "/icon-128x128.png", sizes: "128x128", type: "image/png", purpose: "any" },
          { src: "/icon-144x144.png", sizes: "144x144", type: "image/png", purpose: "any" },
          { src: "/icon-152x152.png", sizes: "152x152", type: "image/png", purpose: "any" },
          { src: "/icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "/icon-256x256.png", sizes: "256x256", type: "image/png", purpose: "any" },
          { src: "/icon-384x384.png", sizes: "384x384", type: "image/png", purpose: "any" },
          { src: "/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: {
        // Cache all static assets
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        // Don't cache Supabase API calls
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
        // Take control immediately on next open — no need to close all tabs first
        skipWaiting: true,
        clientsClaim: true
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvZ2lmdGVkLWdyZWF0LWhlaXNlbmJlcmcvbW50L1ZpcnR1YWwgVm9sdW50ZWVyL2VsbGlzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3Nlc3Npb25zL2dpZnRlZC1ncmVhdC1oZWlzZW5iZXJnL21udC9WaXJ0dWFsIFZvbHVudGVlci9lbGxpc3Mvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3Nlc3Npb25zL2dpZnRlZC1ncmVhdC1oZWlzZW5iZXJnL21udC9WaXJ0dWFsJTIwVm9sdW50ZWVyL2VsbGlzcy92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBWaXRlUFdBKHtcbiAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxuICAgICAgaW5jbHVkZUFzc2V0czogWydmYXZpY29uLmljbycsICdmYXZpY29uLTE2eDE2LnBuZycsICdmYXZpY29uLTMyeDMyLnBuZycsICdhcHBsZS10b3VjaC1pY29uLnBuZycsICdpY29uLTE5MngxOTIucG5nJywgJ2ljb24tNTEyeDUxMi5wbmcnXSxcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIG5hbWU6ICdFbGxpc3MnLFxuICAgICAgICBzaG9ydF9uYW1lOiAnRWxsaXNzJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdLaW5kIEhlYXJ0cy4gQmV0dGVyIExpdmVzLicsXG4gICAgICAgIHN0YXJ0X3VybDogJy8nLFxuICAgICAgICBkaXNwbGF5OiAnc3RhbmRhbG9uZScsXG4gICAgICAgIGJhY2tncm91bmRfY29sb3I6ICcjZmFmOGY1JyxcbiAgICAgICAgdGhlbWVfY29sb3I6ICcjMzI0YTdkJyxcbiAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICB7IHNyYzogJy9pY29uLTcyeDcyLnBuZycsICAgc2l6ZXM6ICc3Mng3MicsICAgdHlwZTogJ2ltYWdlL3BuZycsIHB1cnBvc2U6ICdhbnknIH0sXG4gICAgICAgICAgeyBzcmM6ICcvaWNvbi05Nng5Ni5wbmcnLCAgIHNpemVzOiAnOTZ4OTYnLCAgIHR5cGU6ICdpbWFnZS9wbmcnLCBwdXJwb3NlOiAnYW55JyB9LFxuICAgICAgICAgIHsgc3JjOiAnL2ljb24tMTI4eDEyOC5wbmcnLCBzaXplczogJzEyOHgxMjgnLCB0eXBlOiAnaW1hZ2UvcG5nJywgcHVycG9zZTogJ2FueScgfSxcbiAgICAgICAgICB7IHNyYzogJy9pY29uLTE0NHgxNDQucG5nJywgc2l6ZXM6ICcxNDR4MTQ0JywgdHlwZTogJ2ltYWdlL3BuZycsIHB1cnBvc2U6ICdhbnknIH0sXG4gICAgICAgICAgeyBzcmM6ICcvaWNvbi0xNTJ4MTUyLnBuZycsIHNpemVzOiAnMTUyeDE1MicsIHR5cGU6ICdpbWFnZS9wbmcnLCBwdXJwb3NlOiAnYW55JyB9LFxuICAgICAgICAgIHsgc3JjOiAnL2ljb24tMTkyeDE5Mi5wbmcnLCBzaXplczogJzE5MngxOTInLCB0eXBlOiAnaW1hZ2UvcG5nJywgcHVycG9zZTogJ2FueScgfSxcbiAgICAgICAgICB7IHNyYzogJy9pY29uLTE5MngxOTIucG5nJywgc2l6ZXM6ICcxOTJ4MTkyJywgdHlwZTogJ2ltYWdlL3BuZycsIHB1cnBvc2U6ICdtYXNrYWJsZScgfSxcbiAgICAgICAgICB7IHNyYzogJy9pY29uLTI1NngyNTYucG5nJywgc2l6ZXM6ICcyNTZ4MjU2JywgdHlwZTogJ2ltYWdlL3BuZycsIHB1cnBvc2U6ICdhbnknIH0sXG4gICAgICAgICAgeyBzcmM6ICcvaWNvbi0zODR4Mzg0LnBuZycsIHNpemVzOiAnMzg0eDM4NCcsIHR5cGU6ICdpbWFnZS9wbmcnLCBwdXJwb3NlOiAnYW55JyB9LFxuICAgICAgICAgIHsgc3JjOiAnL2ljb24tNTEyeDUxMi5wbmcnLCBzaXplczogJzUxMng1MTInLCB0eXBlOiAnaW1hZ2UvcG5nJywgcHVycG9zZTogJ2FueScgfSxcbiAgICAgICAgICB7IHNyYzogJy9pY29uLTUxMng1MTIucG5nJywgc2l6ZXM6ICc1MTJ4NTEyJywgdHlwZTogJ2ltYWdlL3BuZycsIHB1cnBvc2U6ICdtYXNrYWJsZScgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICB3b3JrYm94OiB7XG4gICAgICAgIC8vIENhY2hlIGFsbCBzdGF0aWMgYXNzZXRzXG4gICAgICAgIGdsb2JQYXR0ZXJuczogWycqKi8qLntqcyxjc3MsaHRtbCxpY28scG5nLHN2Zyx3b2ZmMn0nXSxcbiAgICAgICAgLy8gRG9uJ3QgY2FjaGUgU3VwYWJhc2UgQVBJIGNhbGxzXG4gICAgICAgIG5hdmlnYXRlRmFsbGJhY2s6ICcvaW5kZXguaHRtbCcsXG4gICAgICAgIG5hdmlnYXRlRmFsbGJhY2tEZW55bGlzdDogWy9eXFwvYXBpXFwvL10sXG4gICAgICAgIC8vIFRha2UgY29udHJvbCBpbW1lZGlhdGVseSBvbiBuZXh0IG9wZW4gXHUyMDE0IG5vIG5lZWQgdG8gY2xvc2UgYWxsIHRhYnMgZmlyc3RcbiAgICAgICAgc2tpcFdhaXRpbmc6IHRydWUsXG4gICAgICAgIGNsaWVudHNDbGFpbTogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSksXG4gIF0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4VyxTQUFTLG9CQUFvQjtBQUMzWSxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBRXhCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxNQUNOLGNBQWM7QUFBQSxNQUNkLGVBQWUsQ0FBQyxlQUFlLHFCQUFxQixxQkFBcUIsd0JBQXdCLG9CQUFvQixrQkFBa0I7QUFBQSxNQUN2SSxVQUFVO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixZQUFZO0FBQUEsUUFDWixhQUFhO0FBQUEsUUFDYixXQUFXO0FBQUEsUUFDWCxTQUFTO0FBQUEsUUFDVCxrQkFBa0I7QUFBQSxRQUNsQixhQUFhO0FBQUEsUUFDYixPQUFPO0FBQUEsVUFDTCxFQUFFLEtBQUssbUJBQXFCLE9BQU8sU0FBVyxNQUFNLGFBQWEsU0FBUyxNQUFNO0FBQUEsVUFDaEYsRUFBRSxLQUFLLG1CQUFxQixPQUFPLFNBQVcsTUFBTSxhQUFhLFNBQVMsTUFBTTtBQUFBLFVBQ2hGLEVBQUUsS0FBSyxxQkFBcUIsT0FBTyxXQUFXLE1BQU0sYUFBYSxTQUFTLE1BQU07QUFBQSxVQUNoRixFQUFFLEtBQUsscUJBQXFCLE9BQU8sV0FBVyxNQUFNLGFBQWEsU0FBUyxNQUFNO0FBQUEsVUFDaEYsRUFBRSxLQUFLLHFCQUFxQixPQUFPLFdBQVcsTUFBTSxhQUFhLFNBQVMsTUFBTTtBQUFBLFVBQ2hGLEVBQUUsS0FBSyxxQkFBcUIsT0FBTyxXQUFXLE1BQU0sYUFBYSxTQUFTLE1BQU07QUFBQSxVQUNoRixFQUFFLEtBQUsscUJBQXFCLE9BQU8sV0FBVyxNQUFNLGFBQWEsU0FBUyxXQUFXO0FBQUEsVUFDckYsRUFBRSxLQUFLLHFCQUFxQixPQUFPLFdBQVcsTUFBTSxhQUFhLFNBQVMsTUFBTTtBQUFBLFVBQ2hGLEVBQUUsS0FBSyxxQkFBcUIsT0FBTyxXQUFXLE1BQU0sYUFBYSxTQUFTLE1BQU07QUFBQSxVQUNoRixFQUFFLEtBQUsscUJBQXFCLE9BQU8sV0FBVyxNQUFNLGFBQWEsU0FBUyxNQUFNO0FBQUEsVUFDaEYsRUFBRSxLQUFLLHFCQUFxQixPQUFPLFdBQVcsTUFBTSxhQUFhLFNBQVMsV0FBVztBQUFBLFFBQ3ZGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsU0FBUztBQUFBO0FBQUEsUUFFUCxjQUFjLENBQUMsc0NBQXNDO0FBQUE7QUFBQSxRQUVyRCxrQkFBa0I7QUFBQSxRQUNsQiwwQkFBMEIsQ0FBQyxVQUFVO0FBQUE7QUFBQSxRQUVyQyxhQUFhO0FBQUEsUUFDYixjQUFjO0FBQUEsTUFDaEI7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
