import React from "react";

interface PerformanceMeterProps {
    score: number;
}

export const PerformanceMeter: React.FC<PerformanceMeterProps> = ({
    score,
}) => {
    const validatedScore = Math.min(Math.max(score, 0), 100);

    return (
        <div
            className="mt-6 p-4 bg-white rounded-lg border"
            style={{ borderColor: "var(--color-border)" }}
        >
            <h3
                className="text-sm font-semibold mb-3"
                style={{ color: "var(--color-text-primary)" }}
            >
                AI Performance Meter
            </h3>

            {/* The Gradient Bar Container */}
            <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                {/* The Actual Gradient Background */}
                <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                        background:
                            "linear-gradient(to right, #ef4444, #f59e0b, #22c55e)",
                    }}
                />

                {/* The Floating Indicator (The Black Line) */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-black shadow-sm transition-all duration-500 ease-in-out"
                    style={{ left: `${validatedScore}%` }}
                />
            </div>

            {/* Numerical Display */}
            <div className="text-center mt-3">
                <p className="text-xs text-gray-700 uppercase font-semibold">
                    Confidence Score
                </p>
                <p
                    className="text-lg font-bold"
                    style={{
                        color: validatedScore > 70 ? "#22c55e" : "#f59e0b",
                    }}
                >
                    {validatedScore}%
                </p>
            </div>
        </div>
    );
};
