import React, { useEffect, useState, useCallback } from 'react';
import { getAdminStats, type AdminStats } from '../api/client';
import { MessageSquare, Users, UserPlus, Activity } from 'lucide-react';

export const DashboardScreen: React.FC = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        const result = await getAdminStats();
        setLoading(false);
        if ('error' in result) {
            setError(
                result.status === 401
                    ? 'Please sign in to view dashboard stats.'
                    : result.error
            );
            setStats(null);
            return;
        }
        setStats(result.data);
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading && !stats) {
        return (
            <div className="min-h-full">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-(--color-text-primary)">
                        Dashboard
                    </h1>
                    <p className="text-sm mt-1 text-(--color-text-muted)">
                        Overview of your chatbot performance
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border) animate-pulse"
                        >
                            <div className="h-4 w-24 bg-(--color-bg-secondary) rounded mb-4" />
                            <div className="h-9 w-16 bg-(--color-bg-secondary) rounded" />
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border) animate-pulse">
                    <div className="h-6 w-40 bg-(--color-bg-secondary) rounded mb-4" />
                    <div className="h-32 bg-(--color-bg-secondary) rounded" />
                </div>
            </div>
        );
    }

    if (error && !stats) {
        return (
            <div className="min-h-full">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-(--color-text-primary)">
                        Dashboard
                    </h1>
                    <p className="text-sm mt-1 text-(--color-text-muted)">
                        Overview of your chatbot performance
                    </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border)">
                    <div className="text-center py-12">
                        <p className="text-(--color-danger) mb-2">{error}</p>
                        <button
                            type="button"
                            onClick={fetchStats}
                            className="px-4 py-2 rounded-lg bg-(--color-primary) text-white hover:opacity-90 transition-opacity"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const data = stats ?? {
        total_conversations: 0,
        active_conversations: 0,
        total_leads: 0,
        recent_activity: [],
    };

    return (
        <div className="min-h-full">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-(--color-text-primary)">
                        Dashboard
                    </h1>
                    <p className="text-sm mt-1 text-(--color-text-muted)">
                        Overview of your chatbot performance
                    </p>
                </div>
                <button
                    type="button"
                    onClick={fetchStats}
                    disabled={loading}
                    className="text-sm text-(--color-primary) hover:underline disabled:opacity-50"
                >
                    {loading ? 'Refreshing…' : 'Refresh'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard
                    title="Total Conversations"
                    value={data.total_conversations}
                    icon={<MessageSquare className="w-5 h-5" />}
                    color="--color-primary"
                />
                <StatCard
                    title="Active Conversations"
                    value={data.active_conversations}
                    icon={<Activity className="w-5 h-5" />}
                    color="--color-success"
                />
                <StatCard
                    title="Total Leads"
                    value={data.total_leads}
                    icon={<UserPlus className="w-5 h-5" />}
                    color="--color-info"
                />
                <StatCard
                    title="Recent activity (sessions)"
                    value={data.recent_activity.length}
                    icon={<Users className="w-5 h-5" />}
                    color="--color-warning"
                />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border)">
                <h2 className="text-xl font-semibold mb-4 text-(--color-text-primary)">
                    Recent Activity
                </h2>
                {data.recent_activity.length === 0 ? (
                    <div className="text-center py-12 text-(--color-text-muted)">
                        <p>No recent activity</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-(--color-border)">
                        {data.recent_activity.map((item) => (
                            <li
                                key={item.session_id}
                                className="py-3 flex items-center justify-between gap-4"
                            >
                                <span className="text-sm text-(--color-text-primary) truncate">
                                    Session with {item.consumer_name || 'Unknown consumer'}
                                </span>
                                <span className="text-sm text-(--color-text-secondary) shrink-0">
                                    {item.message_count} message
                                    {item.message_count !== 1 ? 's' : ''}
                                </span>
                                <span className="text-sm text-(--color-text-muted) shrink-0">
                                    {formatRelativeTime(item.updated_at)}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

function StatCard({
    title,
    value,
    icon,
    color,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border)">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-(--color-text-muted)">
                    {title}
                </h3>
                <span style={{ color: `var(${color})` }}>{icon}</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: `var(${color})` }}>
                {value}
            </p>
        </div>
    );
}

function formatRelativeTime(iso: string): string {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}
