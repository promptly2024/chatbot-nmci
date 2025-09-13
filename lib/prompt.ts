/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_REGISTRY } from "./api/apiRegistry";

export function buildApiResponsePrompt(
   userMessage: string,
   apiSpec: any,
   apiResponse: any
) {
   return `
You are a helpful assistant for NMCI Business Group.

The user originally asked:
"${userMessage}"

We selected the following API:
${JSON.stringify(apiSpec, null, 2)}

The API returned the following response:
${JSON.stringify(apiResponse, null, 2)}

Task:
1. Write a clear, professional, and helpful response to the user based *only* on the API response:
   - Write a clear, professional, and helpful response to the user.
   - The reply can include insights, summaries, or key data points from the API response.
   - It can be very long if needed to fully answer the user's question.
   - If the user asked for specific data, provide that data clearly.
   - If the user asked for a summary or analysis, provide that.
   - If the user asked for recommendations or next steps, provide those.
   - Use information from the API response only.
   - If the API response is empty, unclear, or has missing fields, politely mention that data was not found or is unavailable.
   - Do NOT expose raw JSON, internal API names, or technical details.
   - Make the answer business-friendly and easy to understand.

2. Also generate metadata that strictly follows the schema below, so the frontend can render it directly.
   - If the API response does not contain structured data, set type to "none" and leave data empty.
   - If the API response contains tabular data, set type to "table" and fill in headers and rows.
   - If the API response contains numerical data suitable for charts, choose the best chart type (bar, line, pie) and fill in items.
   - If the API response contains key metrics, set type to "kpi" and fill in kpis with label, value, unit (if any), and trend (if known).
   - If unsure about the best visualization, choose "none".
   - Ensure the metadata is accurate and matches the API response data.
   - Metadata is optional, your best focus should be on writing a great reply to the user.

Metadata Schema (constant across all responses):
{
  "type": "table" | "bar" | "line" | "pie" | "kpi" | "none",
  "title": string (optional),
  "description": string (optional),
  "data": {
    "headers"?: string[],          // for tables
    "rows"?: any[][],              // for tables
    "items"?: {                    // for charts
      "label": string,
      "value": number
    }[],
    "kpis"?: {                     // for KPI metrics
      "label": string,
      "value": number | string,
      "unit"?: string,
      "trend"?: "up" | "down" | "neutral"
    }[]
  }
}

Response Format (must be valid JSON):
{
  "reply": string,
  "metadata": Metadata
}
`.trim();
}


export function buildApiSelectionPrompt(content: string, context: { senderRole: string; message: string }[] = []) {
   return `
You are an assistant for NMCI Business Group.

The user asked: "${content}"

We have the following API registry:
${JSON.stringify(API_REGISTRY, null, 2)}

Task:
- Select the *single most relevant API* for this request.
- Fill in parameters if possible from the user message and context.
- If information is missing, leave parameter values empty ("").
- If no API matches, set api = null.
- Preserve piped parameter names exactly as specified in the API definition.

Parameter Handling Guidelines:
- Keep piped parameter names intact (e.g., "creation_date_interval|creation_start_date|creation_end_date")
- Pipe characters (|) in JSON object keys are valid JSON according to specification

Response Format:
We have the following API registry:
${JSON.stringify(API_REGISTRY, null, 2)}

Task:
- Select the *single most relevant API* for this request.
- Fill in parameters if possible from the user message and context.
- If information is missing, leave parameter values empty ("").
- If the API related to reporting, set isReportingApi to true because it uses a different base URL.
- If no API matches, set api = null.

Response Format:
{
  "name": string,
  "method": string,
  "endpoint": string,
  "isReportingApi": boolean,
  "pathParams": { key: value },
  "queryParams": { key: value },
  "body": { ... }
}

Conversation context: ${JSON.stringify(context, null, 2)}
`.trim();
}




const COMPANY_CONTEXT = `
National Marine Consultants Inc (NMCI Group)

NMCI Group is a leading provider of Survey, Inspection, Laboratory Testing and PSI Audit Services worldwide. 
We supply value-added services to industries like Maritime, Petroleum, Automotive, and Environmental.

Core Service Areas:
A. Survey & Inspection
   - Marine & Cargo Survey
   - Container & Seal Inspection
   - Commodities Inspections
   - Ready Made Garment (RMG) Facility Inspections
   - Consumer Products Inspections
   - Automobile Inspections

B. Petroleum Products
   - Analytical Services
   - Cargo Treatment Services
   - Blending Services
   - Sampling, Gauging, Inspection, Inventories

C. Scrap / Recycled Products
   - Scrap Metal Inspection
   - Waste Paper Inspection
   - India Scrap Inspection
   - Indonesia Waste Paper Inspection

D. Audit
   - PSI Audit Services
   - Shipment Valuation Audit
   - Customs Duty Compliance Audit
   - Terminal Facility Audit

E. PSI
   - Pre-Shipment Inspection
   - Valuation Inspections
   - Quality and Quantity Inspection
`;

export function buildClassificationPrompt(content: string, context: { senderRole: string; message: string }[] = []) {
   const contextSection = context.length
      ? `
Conversation Context:
- Total previous messages: ${context.length}
- Format: [{senderRole: "USER"|"ASSISTANT", message: "content"}]
- Use context only if it helps disambiguate intent.
Last few messages: ${JSON.stringify(context, null, 2)}`
      : "";

   return `
You are a helpful assistant for NMCI Business Group. 
Your job is to classify a user message into one of three intents and generate an appropriate response.

Company Background:
${COMPANY_CONTEXT}

Classification Rules:
1. "greeting" → General queries or salutations. Provide a polite reply.
2. "data_query" → Requests needing database info (e.g., stats, user info). In this case, "reply" must be "" (empty string).
3. "other" → Any unrelated question; respond if you have knowledge.

Response Format Requirements:
- Respond *only* in valid JSON.
- JSON keys must be: 
   "intent": "greeting" | "data_query" | "other"
   "reply": string (empty if "data_query")
   "title": short string describing conversation (not too short and too long, descriptive)
- Use double quotes around all strings.
- Do not add explanations, text, or code blocks.

User message: "${content}"
${contextSection}

Example of correct output:
{
  "intent": "greeting",
  "reply": "Hello! How can I help you today?",
  "title": "User Greeting"
}
  `.trim();
}
