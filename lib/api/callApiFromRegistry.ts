import { generateGeminiResponse } from "@/utils/generateGeminiResponse";
import { getAccessToken } from "../auth/tokenManager";
import { buildApiResponsePrompt } from "../prompt";

export type ApiData = {
    name: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    endpoint: string;
    pathParams?: Record<string, string>;
    queryParams?: Record<string, string>;
    body?: Record<string, unknown> | null;
    isReportingApi: boolean;
    headers?: Record<string, string>;
};

const BASE_URL = "https://be.letstranzact.com";
const REPORTING_URL = "https://reporting.letstranzact.com";

export async function callApiFromRegistry(apiData: ApiData, content: string) {
    if (!apiData) return "No API data provided.";

    // Replace path params in endpoint
    let url = `${apiData.endpoint}`;

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
        const baseUrl = apiData.isReportingApi ? REPORTING_URL : BASE_URL;
        const fullUrl = `${baseUrl}${url}`;

        console.log(`\n\nCalling API: ${apiData.method} ${fullUrl}`);

        const token = await getAccessToken();
        console.log("\nUsing Access Token:", token ? "Yes" : "No");

        const res = await fetch(fullUrl, {
            method: apiData.method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: apiData.method !== "GET" ? JSON.stringify(apiData.body) : undefined,
        });
        console.log(`\nCalling this API:\n
            await fetch(${fullUrl}, {
                method: "${apiData.method}",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: Bearer "${token}",
                },
                body: ${apiData.method !== "GET" ? JSON.stringify(apiData.body) : "undefined"},
            });\n\n\n
        `);

        if (!res.ok) {
            let errorDetails = "";
            try {
                errorDetails = await res.text();
            } catch { }
            throw new Error(
                `API call failed: ${res.status} ${res.statusText}\n${errorDetails}`
            );
        }
        const data = await res.clone().json();
        // console.log("\n\nAPI Response Data:", JSON.stringify(data, null, 2));
        return JSON.stringify(data, null, 2);
        const geminiFinalResponse = await generateGeminiResponse(buildApiResponsePrompt(content, apiData, data));
        const text = geminiFinalResponse.trim().replace(/```json/g, "").replace(/```/g, "").trim();

        let geminiData: { reply: string };
        try {
            geminiData = JSON.parse(text);
        } catch (err) {
            console.error("Failed to parse GEMINI response:", err, text);
            geminiData = { reply: text };
        }
        return geminiData.reply || "No reply from API response.";
    } catch (error) {
        console.error("Error calling API:", error);
        throw error;
    }
}
