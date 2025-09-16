"use client";

import React from "react";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
    const [response, setResponse] = useState("null");
    const [loading, setLoading] = useState(false);
    const [access_token, setAccess_token] = useState<string>("");

    React.useEffect(() => {
        // get the access token from local storage
        const token = localStorage.getItem('access_token');
        if (token) {
            setAccess_token(token);
            toast.success('Access token retrieved from local storage');
        } else {
            toast.error('No access token found. Please log in first.');
        }
    }, []);

    const callApi = async () => {
        setLoading(true);
        setResponse("null");
        if (!access_token) {
            toast.error('No access token found. Please log in first.');
            setLoading(false);
            return;
        }
        toast.info('Calling Sales Invoice Register API...');

        const requestBody = {
            selected_columns: [],
            grouped_data: true,
            selected_group_columns: [],
            initial_request: true,
            numeric_search_prefixes: {},
            report: { id: "29" },
            search: {},
            pagination: {
                group_by: [],
                group_desc: [],
                items_per_page: 50,
                multi_sort: false,
                must_sort: false,
                page: 1,
                sort_by: [],
                sort_desc: []
            },
            "invoice_date_interval|invoice_from_date|invoice_to_date": "Last 180 Days",
            "creation_date_interval|creation_start_date|creation_end_date": "Last 180 Days",
            "payment_due_date_interval|payment_start_date|payment_end_date": "All",
            dispatch_details_status: "All",
            company_buyer: "",
            tag_sales: "",
            item_id: "",
            currency_type: "Rupee",
            document_status: "All Sent",
            invoice_payment_status: "All",
            output: "display"
        };

        try {
            // Call your local API route instead of the external URL directly
            const res = await fetch("https://reporting.letstranzact.com/generate_report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU3NjY0MTcwLCJpYXQiOjE3NTc2NjMyNzAsImp0aSI6IjRhNDQ5NDNiOTYzZjQ4ODlhMzgzMWU4OGI0MWE1NmQyIiwidXNlcl9pZCI6MTAwOTc2NiwidXNlcl9mdWxsX25hbWUiOiJTaGFpbCBKYWlzd2FsIiwiZmlyc3RfbmFtZSI6IlNoYWlsIiwibGFzdF9uYW1lIjoiSmFpc3dhbCIsImNvbnRhY3Rfbm8iOiI4MDA0NTUzNDkwIiwidXNlcm5hbWUiOiJwcm9tcHRseTA2QGdtYWlsLmNvbSIsInByb2ZpbGVfcGhvdG8iOiJkZWZhdWx0X2ltYWdlcy9wcm9maWxlX2RlZmF1bHQuanBnIiwiY29tcGFueV9uYW1lIjoiTk1DSSBJTlNQRUNUSU9OUyAmIFNVUlZFWSBDT01QQU5ZIFBSSVZBVEUgTElNSVRFRCIsImNvbXBhbnlfaWQiOjIyNjE4NywiY29tcGFueV9pc19jbGllbnQiOjEsInV0bV9wYXJhbWV0ZXJzIjp7ImFjdGlvbiI6InVua25vd24iLCJ1dG1fdGVybSI6Inx8IiwidXRtX21lZGl1bSI6InBwYyIsInV0bV9zb3VyY2UiOiJnb29nbGUiLCJ1dG1fY29udGVudCI6InVua25vd24iLCJ1dG1fY2FtcGFpZ24iOiJJbnZlbnRvcnlfRGlzY292ZXJ5X0FCX1Rlc3QiLCJzaWdudXBfYXR0ZW1wdCI6ZmFsc2UsInV0bV9zaGFyZV90eXBlIjoiY29weV9saW5rIiwidXRtX2dlbmVyYXRlZF9ieSI6IjIxNDMyMCJ9LCJwcm9maWxlX2NyZWF0aW9uX2RhdGUiOiIyMDI1MDkwNSIsInBlX3Njb3JlIjoxNzAwMiwiaXNfcGFpZCI6IlBBSUQiLCJvbmJvYXJkaW5nX2NvbXBsZXRlIjp0cnVlLCJlbWFpbCI6InByb21wdGx5MDZAZ21haWwuY29tIn0.VXkrzs6gz9656zdpjlT6oCr0YNPeZI7xblT0VtxG9pA'
                },
                body: JSON.stringify({
                    selected_columns: [],
                    grouped_data: true,
                    selected_group_columns: [],
                    initial_request: true,
                    numeric_search_prefixes: {},
                    report: { id: "29" },
                    search: {},
                    pagination: {
                        group_by: [],
                        group_desc: [],
                        items_per_page: 50,
                        multi_sort: false,
                        must_sort: false,
                        page: 1,
                        sort_by: [],
                        sort_desc: []
                    },
                    invoice_date_interval: "Last 180 Days",
                    creation_date_interval: "",
                    payment_due_date_interval: "All",
                    dispatch_details_status: "All",
                    company_buyer: "",
                    tag_sales: "",
                    item_id: "",
                    currency_type: "Rupee",
                    document_status: "All Sent",
                    invoice_payment_status: "All",
                    output: "display"
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(`HTTP error! status: ${res.status} - ${errorData.error || res.statusText}`);
            }

            toast.success('Sales Invoice Register API call successful!');
            const data = await res.json();
            setResponse(data);
        } catch (err: unknown) {
            let errorMessage = 'An unknown error occurred';
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            toast.error(errorMessage);
            setResponse(errorMessage);
        }
        setLoading(false);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Sales Invoice Register Test</h1>
            <p className="mb-4">Click the button below to test the POST API.</p>

            <button
                onClick={callApi}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                disabled={loading}
            >
                Generate Sales Invoice Register (POST)
            </button>

            {loading && <p className="mt-4 text-blue-600">Loading...</p>}

            {response !== "null" && (
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">Sales Invoice Register Response:</h2>
                    <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto text-sm max-h-96">
                        {JSON.stringify(response, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
