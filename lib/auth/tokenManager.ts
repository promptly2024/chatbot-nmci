// lib/auth/tokenManager.ts

import { TRANZACT_EMAIL, TRANZACT_PASS } from "../env";

let cachedAccessToken: string | null = null;
let tokenExpiry: number | null = null;

const LOGIN_URL = "https://be.letstranzact.com/main/login/password-login/";

const CREDENTIALS = {
    email: TRANZACT_EMAIL,
    password: TRANZACT_PASS,
};

const ACCESS_TOKEN_LIFETIME = 15 * 60; // 15 minutes

export async function getAccessToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);

    // If we have a valid cached token, reuse it
    if (cachedAccessToken && tokenExpiry && now < tokenExpiry - 30) {
        console.log("\nReusing cached access token.");
        return cachedAccessToken;
    }

    // Otherwise, login again
    console.log("\nFetching new access token by logging in.");
    return await loginAndCacheTokens();
}

async function loginAndCacheTokens(): Promise<string> {
    const res = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(CREDENTIALS),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("\n\nLogin Failed:", res.status, res.statusText, text);
        throw new Error(`Login failed: ${res.status} ${res.statusText} ${text}`);
    }

    const data = await res.json();
    if (data.status !== 1) {
        console.error("\n\nLogin Failed:", JSON.stringify(data));
        throw new Error("Login failed: " + JSON.stringify(data));
    }

    // cache tokens in memory
    cachedAccessToken = data.data.access_token;

    // set expiry window manually
    tokenExpiry = Math.floor(Date.now() / 1000) + ACCESS_TOKEN_LIFETIME;

    console.log("\nNew access token fetched and cached. Expires in 15 minutes.");
    return cachedAccessToken!;
}
