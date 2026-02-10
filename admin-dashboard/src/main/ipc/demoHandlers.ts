import { ipcMain } from 'electron';
import { demoFunction } from '../services/demo/demoService';
import { IPC_CHANNELS } from 'shared/channels';

export function registerDemoHandlers() {
  ipcMain.handle(IPC_CHANNELS.DEMO.DEMONSTRATE_FUNCTION, () => {
    console.log('demoHandler');
    demoFunction();
  });
}
