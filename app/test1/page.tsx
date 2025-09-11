// app/page.tsx (Next.js 13+ with App Router)

"use client";

import React from "react";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
    const [response1, setResponse1] = useState("null");
    const [response2, setResponse2] = useState("null");
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

    const callApi1 = async () => {
        setLoading(true);
        setResponse1("null");
        if (!access_token) {
            toast.error('No access token found. Please log in first.');
            setLoading(false);
            return;
        }
        toast.info('Calling API...');
        try {
            const res = await fetch('https://be.letstranzact.com/settings/product/get-products?product_type=Both', {
            // const res = await fetch('https://be.letstranzact.com/settings/product/get-products/?product_name=Raw Material&itemid=RM01&product_type=Both', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}- ${res.statusText}`);
            }
            toast.success('API call successful!');
            const data = await res.json();
            setResponse1(data);
        } catch (err: unknown) {
            let errorMessage = 'An unknown error occurred';
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            toast.error(errorMessage);
            setResponse1(errorMessage);
        }
        setLoading(false);
    };
    const callApi2 = async () => {
        setLoading(true);
        setResponse2("null");
        if (!access_token) {
            toast.error('No access token found. Please log in first.');
            setLoading(false);
            return;
        }
        toast.info('Calling API...');
        try {
            const res = await fetch('https://be.letstranzact.com/settings/product/get-products/?product_name=Raw Material&itemid=RM01&product_type=Both', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}- ${res.statusText}`);
            }
            toast.success('API call successful!');
            const data = await res.json();
            setResponse2(data);
        } catch (err: unknown) {
            let errorMessage = 'An unknown error occurred';
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            toast.error(errorMessage);
            setResponse2(errorMessage);
        }
        setLoading(false);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page</h1>
            <p className="mb-4">Click the buttons below to call the APIs.</p>
            <button
                onClick={callApi1}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
                Call API 1 (GET)
            </button>
            <button
                onClick={callApi2}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
                Call API 2 (GET)
            </button>

            {loading && <p className="mt-4">Loading...</p>}

            {response1 && (
                <div>
                    <h2 className="text-2xl font-bold mb-2">API 1 Response:</h2>
                    <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto text-sm">
                        {JSON.stringify(response1, null, 2)}
                    </pre>
                </div>
            )}
            {response2 && (
                <div>
                    <h2 className="text-2xl font-bold mb-2">API 2 Response:</h2>
                    <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto text-sm">
                        {JSON.stringify(response2, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
