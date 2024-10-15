import MusicPlayer from '@/components/MusicPlayer';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  return (
    <div className="container mx-auto">
      <MusicPlayer />
      <Toaster />
    </div>
  );
}