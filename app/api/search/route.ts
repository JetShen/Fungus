"use server";
import { NextResponse, NextRequest } from "next/server";
import { youtube } from 'scrape-youtube';

// This is the route for the search API
export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const query = request.nextUrl.searchParams.get('query');

        // If no query is provided, return an error
        if (!query) {
            return NextResponse.json({ error: 'Missing Query!' }, { status: 400 });
        }

        // Fetch the data from the Youtube API
        const results = await youtube.search(query);
        const videos = results.videos;

        if (!videos || videos.length === 0) {
            return NextResponse.json({ error: 'No Videos Found!' }, { status: 404 });
        }


        // Return the data
        return NextResponse.json({ Videos: videos }, { status: 200 });
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}