export function ContactsScreen() {
    return (
        <div className="h-full">
            <div className="mb-6">
                <h1
                    className="text-3xl font-bold"
                    style={{ color: 'var(--color-text-primary)' }}
                >
                    Contacts and Leads
                </h1>
                <p
                    className="text-sm mt-1"
                    style={{ color: 'var(--color-text-muted)' }}
                >
                    Manage your captured leads and contacts
                </p>
            </div>

            <div
                className="bg-white rounded-xl p-6 shadow-sm border"
                style={{ borderColor: 'var(--color-border)' }}
            >
                <div
                    className="text-center py-12"
                    style={{ color: 'var(--color-text-muted)' }}
                >
                    <p>No contacts yet</p>
                </div>
            </div>
        </div>
    );
}
