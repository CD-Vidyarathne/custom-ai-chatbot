import React from 'react';
import { ipcRenderer } from 'electron';
import { IPC_CHANNELS } from 'shared/channels';

export const DashboardScreen: React.FC = () => {
    const checkIPCCommunication = () => {
        window.electron.ipcRenderer.invoke(IPC_CHANNELS.DEMO.DEMONSTRATE_FUNCTION);
    };

    return (
        <div className="h-full">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-(--color-text-primary)">
                    Dashboard
                </h1>
                <p className="text-sm mt-1 text-(--color-text-muted)">
                    Overview of your chatbot performance
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Total Conversations */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border)">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-(--color-text-muted)">
                            Total Conversations
                        </h3>
                    </div>
                    <p className="text-3xl font-bold text-(--color-primary)">0</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border)">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-(--color-text-muted)">
                            Total Leads
                        </h3>
                    </div>
                    <p className="text-3xl font-bold text-(--color-info)">0</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border)">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-(--color-text-muted)">
                            Today's Messages
                        </h3>
                    </div>
                    <p className="text-3xl font-bold text-(--color-warning)">0</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border)">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-(--color-text-muted)">
                            Today's Messages
                        </h3>
                    </div>
                    <p className="text-3xl font-bold text-(--color-warning)">0</p>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border)">
                <h2 className="text-xl font-semibold mb-4 text-(--color-text-primary)">
                    Recent Activity
                </h2>
                <div className="text-center py-12 text-(--color-text-muted)">
                    <p>No recent activity</p>
                </div>
            </div>
        </div>
    );
};
