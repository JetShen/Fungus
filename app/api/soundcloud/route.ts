"use server";
import { NextResponse, NextRequest } from "next/server";
import { chromium } from 'playwright';
import { Song } from "@/types/MusicTypes";

// this works but it's not the best way to do it because it's too slow

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const query = request.nextUrl.searchParams.get('query');

    if (!query) {
      return NextResponse.json({ error: 'Missing Query!' }, { status: 400 });
    }

    const browser = await chromium.launch({
      headless: true 
    });
    
    try {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      const url = `https://soundcloud.com/search/sounds?q=${query}`;
      await page.goto(url, { waitUntil: 'networkidle' });
      
      await page.waitForSelector('.searchItem', { timeout: 10000 });

      const songs: Song[] = await page.evaluate(() => {
        const songElements = Array.from(document.querySelectorAll('.searchItem')).slice(0, 10);
        
        return songElements.map((el, index) => {
          const linkElement = el.querySelector('.sound__coverArt') as HTMLAnchorElement;
          const artistElement = el.querySelector('.soundTitle__usernameText');
          const titleElement = el.querySelector('.soundTitle__title span');

          const link = linkElement?.getAttribute('href');
          const artist = artistElement?.textContent?.trim() || '';
          const title = titleElement?.textContent?.trim() || '';
          const fullLink = link ? `https://soundcloud.com${link}` : '';


          return {
            id: index,
            artist,
            title,
            url: fullLink
          };
        }).filter(song => song.artist && song.title && song.url);
      });

      if (songs.length === 0) {
        return NextResponse.json({ error: 'No Videos Found!' }, { status: 404 });
      }

      return NextResponse.json({ Songs: songs }, { status: 200 });

    } finally {
      await browser.close();
    }
    
  } catch (error) {
    console.error("Error during scraping:", error);
    return NextResponse.json({ error: error || 'Internal Server Error' }, { status: 500 });
  }
}