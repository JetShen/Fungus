// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);


contextBridge.exposeInMainWorld('ruta', {
  rutaMusic(path: string) {
    return ipcRenderer.invoke('rutaMusic', path);
  }
})

contextBridge.exposeInMainWorld('m3u8', {
  getm3u8_url(url: string) {
    return ipcRenderer.invoke('getm3u8_url', url);
  }
})

contextBridge.exposeInMainWorld('search',{
  fetchYT(query: string) {
    return ipcRenderer.invoke('fetchYT', query);
  }
})


export type ElectronHandler = typeof electronHandler;
