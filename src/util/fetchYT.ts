import { youtube } from 'scrape-youtube';



export default async function fetchYT(qry: string) {
  const videos = await youtube.search(qry).then((results: any) => {
    return results.videos;
  }).catch(console.error);
  return videos;
}

