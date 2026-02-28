export function PersonaSettingsScreen() {
    return (
        <div className="min-h-full space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-(--color-text-primary)">
                    Persona Settings
                </h1>
                <p className="text-sm mt-1 text-(--color-text-muted)">
                    Configure your chatbot&apos;s personality and behavior
                </p>
            </div>

            <section className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border)">
                <h2 className="text-lg font-semibold mb-4 text-(--color-text-primary)">
                    Agent Identity
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-(--color-text-secondary)">
                            Agent Name
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Ava"
                            className="w-full px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-border-focus) bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-(--color-text-secondary)">
                            Agent Title
                        </label>
                        <input
                            type="text"
                            placeholder="Customer Support Assistant"
                            className="w-full px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-border-focus) bg-white"
                        />
                    </div>
                </div>
            </section>

            <section className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border)">
                <h2 className="text-lg font-semibold mb-4 text-(--color-text-primary)">
                    Company Context
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-(--color-text-secondary)">
                            Company Description
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Describe your company and its mission..."
                            className="w-full px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-border-focus) bg-white"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-(--color-text-secondary)">
                                Location
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. San Francisco, CA"
                                className="w-full px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-border-focus) bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-(--color-text-secondary)">
                                Product Features
                            </label>
                            <input
                                type="text"
                                placeholder="Key features or services"
                                className="w-full px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-border-focus) bg-white"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border)">
                <h2 className="text-lg font-semibold mb-4 text-(--color-text-primary)">
                    Agent Behaviour
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-(--color-text-secondary)">
                            Welcome Message
                        </label>
                        <textarea
                            rows={2}
                            placeholder="Hi! How can I help you today?"
                            className="w-full px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-border-focus) bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-(--color-text-secondary)">
                            Agent Tasks
                        </label>
                        <textarea
                            rows={3}
                            placeholder="List what this agent should help users with..."
                            className="w-full px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-border-focus) bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-(--color-text-secondary)">
                            Additional Information
                        </label>
                        <textarea
                            rows={2}
                            placeholder="Tone, constraints, rules, etc."
                            className="w-full px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-border-focus) bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-(--color-text-secondary)">
                            Conversation Closing Message
                        </label>
                        <input
                            type="text"
                            placeholder="Let me know if you need anything else!"
                            className="w-full px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-border-focus) bg-white"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
