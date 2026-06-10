import { Soriya } from "soriya";

/**
 * Singleton Soriya instance.
 * Service URLs are read from Vite env vars.
 * Add new services here as the platform grows.
 */

const SERVICES = {
  userService: import.meta.env.VITE_USER_SERVICE_URL as string,
};

// Validate at startup
for (const [key, url] of Object.entries(SERVICES)) {
  if (!url) {
    console.warn(
      `[Soriya] Missing env var for ${key}. ` +
      `Set VITE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}_URL in .env`
    );
  }
}

const soriya = new Soriya({ services: SERVICES });

export default soriya;
