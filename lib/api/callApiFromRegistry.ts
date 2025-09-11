import { getAccessToken } from "../auth/tokenManager";

export type ApiData = {
    name: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    endpoint: string;
    pathParams?: Record<string, string>;
    queryParams?: Record<string, string>;
    body?: Record<string, unknown> | null;
    headers?: Record<string, string>;
};

export async function callApiFromRegistry(apiData: ApiData) {
    if (!apiData) return null;

    // Replace path params in endpoint
    let url = apiData.endpoint;
    if (apiData.pathParams) {
        for (const [key, value] of Object.entries(apiData.pathParams)) {
            url = url.replace(`:${key}`, value);
        }
    }
    
    // Add query params
    const query = apiData.queryParams
        ? new URLSearchParams(apiData.queryParams).toString()
        : "";
    if (query) url += `?${query}`;

    try {
        // Full URL (if internal APIs, use absolute URL)
        const baseUrl = process.env.API_BASE_URL || "http://localhost:3000";
        const fullUrl = `${baseUrl}${url}`;

        const res = await fetch(fullUrl, {
            method: apiData.method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await getAccessToken()}`,
            },
            body: apiData.method !== "GET" ? JSON.stringify(apiData.body) : undefined,
        });

        if (!res.ok) {
            throw new Error(`API call failed: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("Error calling API:", error);
        throw error;
    }
}
