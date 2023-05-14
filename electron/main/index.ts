import CrossProcessExports, { app, BrowserWindow, shell, ipcMain, OnBeforeRedirectListenerDetails } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'

var isDev = require('isDev')

if(isDev) {
  console.log("In Development!")
} else {
  console.log("Not in Development!")
}



process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST


console.log(process.env.VITE_DEV_SERVER_URL)
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'



let win: BrowserWindow | null = null
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  
  win = new BrowserWindow({
    autoHideMenuBar: true,
    title: 'LowMusic',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      experimentalFeatures: false,
      preload,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    
  })

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
  } else {
    win.loadFile(indexHtml)
  }

  // win.webContents.session.cookies.set({ url: 'https://www.youtube.com', name: 'Domain', value: 'youtube.com' })
  // //Path
  // win.webContents.session.cookies.set({ url: 'https://www.youtube.com', name: 'Path', value: '/' })
  
  // cookie sameSite None , secure true
  win.webContents.session.cookies.set({
    url: 'https://www.youtube.com',
    name: 'YSC',
    value: 'fb-_rsLkf1g',
    domain: 'youtube.com',
    path: '/',
    secure: true,
    httpOnly: false,
    sameSite: 'no_restriction'
  })
  .catch((error) => {
    console.error(error);
  });
  // again but this time with this url www.youtube.com/embed
  win.webContents.session.cookies.set({
    url: 'https://www.youtube.com/embed',
    name: 'YSC',
    value: 'fb-_rsLkf1g',
    domain: 'youtube.com',
    path: '/',
    secure: true,
    httpOnly: false,
    sameSite: 'no_restriction'
  }).catch((error) => {
    console.error(error);
  });

  //again but now with google.com
  win.webContents.session.cookies.set({
    url: 'https://www.youtube.com/embed',
    name: 'YSC',
    value: 'fb-_rsLkf1g',
    domain: 'www.youtube.com',
    path: '/',
    secure: true,
    httpOnly: false,
    sameSite: 'no_restriction'
  }).catch((error) => {
    console.error(error);
  });

  win.webContents.session.cookies.set({
    url: 'https://www.youtube.com',
    name: 'YSC',
    value: 'fb-_rsLkf1g',
    domain: 'www.youtube.com',
    path: '/',
    secure: true,
    httpOnly: false,
    sameSite: 'no_restriction'
  }).catch((error) => {
    console.error(error);
  });

  // win.webContents.session.cookies.set({
  //   url: 'https://www.youtube.com/',
  //   name: 'VISITOR_INFO1_LIVE',
  //   value: '4KDPLw_gElQ',
  //   domain: '.youtube.com',
  //   path: '/',
  //   secure: true,
  //   httpOnly: false,
  //   sameSite: 'no_restriction'
  // }).catch((error) => {
  //   console.error(error);
  // });

  //to do 
  // fix the cookie problem
  // search the url of the app when it´s packaged
  // this is why https://stackoverflow.com/questions/51969269/embedded-youtube-video-doesnt-work-on-local-server/54736426#54736426

  win.webContents.session.cookies.get({})
  .then((cookies) => {
    console.log("pass")
  })
  .catch((error) => {
    console.error(error);
  });




  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = {
      ...details.responseHeaders,
      'Content-Security-Policy': ["frame-src 'self' https://www.youtube.com"],
      'referrer-policy': 'no-referrer-when-downgrade'
    };
    callback({ responseHeaders });
  });
  

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());

    win.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('https:')) shell.openExternal(url)
      return { action: 'deny' }
    })
  })
}

app.whenReady().then(async () => {
  await createWindow()



  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})




process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});
