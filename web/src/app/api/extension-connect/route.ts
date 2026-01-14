import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        // This endpoint sends the authenticated user's ID to the extension
        // The extension will call this to auto-connect

        // For now, return a simple response
        // The extension should authenticate via the dashboard first
        return NextResponse.json({
            message: 'Please visit dashboard to connect',
            connected: false
        });
    } catch (error) {
        console.error('Error in connect endpoint:', error);
        return NextResponse.json({
            error: 'Server error',
            connected: false
        }, { status: 500 });
    }
}
