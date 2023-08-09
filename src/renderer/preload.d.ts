import { ElectronHandler } from 'main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    ruta: {
      rutaMusic(path: any): Promise<string> ;
    };
    m3u8: {
      getm3u8_url(url: any): Promise<string>;
    };
    search: {
      fetchYT(query: any): Promise<any>;
    };
  }
}

export {};
