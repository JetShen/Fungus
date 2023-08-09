import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

interface FormatInfo {
    protocol: string;
    ext: string;
    resolution: string;
    source_preference: number;
    url: string;
}

interface Metadata {
    formats: FormatInfo[];
}

async function getMetadata(url: string): Promise<Metadata | null> {
    const command = `yt-dlp --dump-json ${url}`;
    try {
        const { stdout, stderr } = await execAsync(command);
        if (!stderr) {
            const metadata = JSON.parse(stdout) as Metadata;
            return metadata;
        } else {
            console.error('Error:', stderr);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function findManifestUrl(url: string): Promise<string | null> {
    const metadata = await getMetadata(url);
    if (metadata) {
        for (const formatInfo of metadata.formats) {
            if (
                formatInfo.protocol === 'm3u8_native' &&
                formatInfo.ext === 'mp4' &&
                formatInfo.resolution === 'audio only' &&
                formatInfo.source_preference === -1
            ) {
                const manifestUrl = formatInfo.url;
                return manifestUrl;
            }
        }
    }
    return null;
}

export async function getm3u8_url(url: string): Promise<string | any> {
    const videoUrl = url;
    const manifestUrl = await findManifestUrl(videoUrl);

    if (manifestUrl) {
        return manifestUrl;
    } else {
        console.log('No matching format found.');
    }
}
