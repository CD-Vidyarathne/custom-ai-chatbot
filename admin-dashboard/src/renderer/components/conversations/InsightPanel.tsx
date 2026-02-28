import React from "react";
import { PerformanceMeter } from "./PerformanceMeter";

interface InsightPanelProps {
    confidenceScore: number;
    customerDetails: { ipLocation: string; currentPage: string };
}

export const InsightPanel: React.FC<InsightPanelProps> = ({
    confidenceScore,
    customerDetails,
}) => {
    return (
        <div
            className="w-full bg-white border-l flex flex-col"
            style={{ borderColor: "var(--color-border)" }}
        >
            <div className="p-4">
                <h2
                    className="text-xl font-semibold border-b border-(--color-border) pb-2 -mx-4 px-4"
                    style={{ color: "var(--color-text-primary)" }}
                >
                    Context & Insights
                </h2>
            </div>
            <div className="p-4">
                <div className="mb-6 border-b border-(--color-border) pb-4 -mx-4 px-4">
                    <p
                        className="text-sm font-semibold mb-2"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        Customer Details
                    </p>
                    <div className="space-y-2">
                        <p
                            className="text-sm font-semibold flex justify-between"
                            style={{ color: "var(--color-text-primary)" }}
                        >
                            <span>IP Location</span>
                            <span>{customerDetails.ipLocation}</span>
                        </p>
                        <p
                            className="text-sm font-semibold flex justify-between"
                            style={{ color: "var(--color-text-primary)" }}
                        >
                            <span>Current Page</span>
                            <span>{customerDetails.currentPage}</span>
                        </p>
                    </div>
                </div>
                {/* <div className="mb-6 border-b border-(--color-border) pb-6 -mx-4 px-4">
                    <h3
                        className="text-sm font-semibold mb-4"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        AI Performance Meter
                    </h3>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <div
                            className="bg-green-500 h-4 rounded-full"
                            style={{ width: `${confidenceScore}%` }}
                        ></div>
                    </div>
                    <p
                        className="text-sm font-semibold text-center"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        Confidence Score:{" "}
                        <span style={{ color: "#22c55e" }}>
                            {confidenceScore}%
                        </span>
                    </p>
                </div> */}

                <div
                    className="border-b pb-6 -mx-4 px-4"
                    style={{ borderColor: "var(--color-border)" }}
                >
                    <PerformanceMeter score={confidenceScore} />
                </div>

                <button className="bg-(--color-primary) text-white px-4 py-2 rounded mt-4 font-semibold">
                    Download Chat Transcript (PDF)
                </button>
            </div>
        </div>
    );
};
