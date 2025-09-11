// lib/env.ts
// Centralized environment variable management with defaults and error handling

export const TRANZACT_EMAIL = process.env.TRANZACT_EMAIL || (() => {
    throw new Error("TRANZACT_EMAIL not set in env");
})();

export const TRANZACT_PASS = process.env.TRANZACT_PASS || (() => {
    throw new Error("TRANZACT_PASS not set in env");
})();

export const DATABASE_URL = process.env.DATABASE_URL || (() => {
    throw new Error("DATABASE_URL not set in env");
})();

export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "iygngvkbfbgdfkgbfkjgkjgjrgeh";

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || (() => {
    throw new Error("GEMINI_API_KEY not set in env");
})();
