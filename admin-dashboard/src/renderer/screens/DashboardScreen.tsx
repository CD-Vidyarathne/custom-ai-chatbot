import React from 'react';
import { ipcRenderer } from 'electron';
import { IPC_CHANNELS } from 'shared/channels';

export const DashboardScreen: React.FC = () => {
  const checkIPCCommunication = () => {
    window.electron.ipcRenderer.invoke(IPC_CHANNELS.DEMO.DEMONSTRATE_FUNCTION);
  };

  return (
    <div className="screen-container">
      <h1>Hello World! This is your Custom AI Chatbot</h1> <br />
      <button onClick={() => checkIPCCommunication()}>
        Check IPC Communication
      </button>
    </div>
  );
};
