import { API_REGISTRY } from "./api/apiRegistry";

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

Response Format:
We have the following API registry:
${JSON.stringify(API_REGISTRY, null, 2)}

Task:
- Select the *single most relevant API* for this request.
- Fill in parameters if possible from the user message and context.
- If information is missing, leave parameter values empty ("").
- If no API matches, set api = null.

Response Format:
{
  "name": string,
  "method": string,
  "endpoint": string,
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
