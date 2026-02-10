import * as dotenv from 'dotenv';
dotenv.config();

import { app } from 'electron';

import { makeAppWithSingleInstanceLock } from 'lib/electron-app/factories/app/instance';
import { makeAppSetup } from 'lib/electron-app/factories/app/setup';
import { MainWindow } from './windows/main';
import { registerAllIPCHandlers } from './ipc/register';

makeAppWithSingleInstanceLock(async () => {
  await app.whenReady();
  registerAllIPCHandlers();
  await makeAppSetup(MainWindow);
});
