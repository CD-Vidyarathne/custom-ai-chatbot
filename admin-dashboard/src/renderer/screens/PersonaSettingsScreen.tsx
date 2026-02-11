export function PersonaSettingsScreen() {
    return (
        <div className="h-full">
            <div className="mb-6">
                <h1
                    className="text-3xl font-bold"
                    style={{ color: 'var(--color-text-primary)' }}
                >
                    Persona Settings
                </h1>
                <p
                    className="text-sm mt-1"
                    style={{ color: 'var(--color-text-muted)' }}
                >
                    Configure your chatbot's personality and behavior
                </p>
            </div>

            <div
                className="bg-white rounded-xl p-6 shadow-sm border"
                style={{ borderColor: 'var(--color-border)' }}
            >
                <p style={{ color: 'var(--color-text-muted)' }}>
                    Persona settings will be configured here
                </p>
            </div>
        </div>
    );
}
