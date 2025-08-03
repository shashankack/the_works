import { cors as honoCors } from "hono/cors";

export const cors = () =>
  honoCors({
    origin: (origin) => {
      // Allow all localhost variations for development
      if (origin?.includes('localhost') || origin?.includes('127.0.0.1')) {
        return origin;
      }
      
      // Allow your specific Vercel domain
      if (origin === 'https://the-works-final.vercel.app') {
        return origin;
      }
      
      // For debugging: log the origin to see what's being requested
      console.log('CORS Origin:', origin);
      
      // Allow the specific domains
      const allowedOrigins = [
        'https://the-works-final.vercel.app',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5137',
      ];
      
      return allowedOrigins.includes(origin || '') ? origin : null;
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowHeaders: [
      "Content-Type", 
      "Authorization", 
      "X-Requested-With",
      "Accept",
      "Origin"
    ],
    exposeHeaders: ["Content-Length", "X-JSON"],
    maxAge: 600,
    credentials: true,
  });
