// app/api/generate-report/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Get the request body and headers
        const body = await request.json();
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json(
                { error: 'Authorization header is required' },
                { status: 401 }
            );
        }

        // Make the request to the external API
        const response = await fetch('https://reporting.letstranzact.com/generate_report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
            body: JSON.stringify(body)
        });

        // Get the response data
        const data = await response.json();
        
        if (!response.ok) {
            return NextResponse.json(
                { error: `External API error: ${response.status} - ${response.statusText}`, details: data },
                { status: response.status }
            );
        }

        // Return the successful response
        return NextResponse.json(data);

    } catch (error: unknown) {
        console.error('API Route Error:', error);

        let message = 'Failed to fetch from reporting service';
        if (error instanceof Error) {
            message = error.message;
        }

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
