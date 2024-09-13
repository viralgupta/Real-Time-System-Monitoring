import { app, shell } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import minimist from 'minimist';
import log from './log'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')


// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let processRunning = false;
let firstTime= true;

const args = minimist(process.argv.slice(2));


// @ts-ignore
let LOG_INTERVAL = args['LOG_INTERVAL'] ?? import.meta.env.VITE_LOG_INTERVAL ?? 15000;
LOG_INTERVAL = parseInt(LOG_INTERVAL);
LOG_INTERVAL = LOG_INTERVAL >= 15000 ? LOG_INTERVAL : 15000;
// @ts-ignore
const SERVER_API = args['SERVER_API'] ?? import.meta.env.VITE_SERVER_API ?? 'http://localhost:3000/api/postData';

function createProcess() {
  processRunning = true;
  setInterval(() => {
    log(SERVER_API, firstTime).then(() => {
      firstTime = false;
    })
  }, LOG_INTERVAL);
}

app.whenReady().then(() => {
  createProcess()
})

app.on('window-all-closed', () => {
  console.log('window-all-closed');
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if(processRunning){
    return;
  } else {
    createProcess()
  }
})

app.on('activate', () => {
  if(processRunning){
    return;
  } else {
    createProcess()
  }
})
