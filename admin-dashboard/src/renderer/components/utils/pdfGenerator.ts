import { jsPDF } from "jspdf";
import { Message } from "../conversations/types";

export const generateChatTranscript = (
    userName: string,
    messages: Message[]
) => {
    const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxLineWidth = pageWidth - margin * 2;

    doc.setFillColor(52, 73, 94);
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("SINOFETCH CORPORATION", margin, 20);

    doc.setFontSize(10);
    doc.text("Official Chat Transcript", margin, 28);

    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.text(`Customer: ${userName}`, margin, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`Exported on: ${new Date().toLocaleString()}`, margin, 55);

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, 60, pageWidth - margin, 60);

    let cursorY = 70;
    doc.setFontSize(11);

    messages.forEach((msg) => {
        const isAI = msg.sender === "ai";
        const label = isAI ? "Sinofetch AI:" : `${userName}:`;

        doc.setFont("helvetica", "bold");
        doc.setTextColor(isAI ? 41 : 0, isAI ? 128 : 0, isAI ? 185 : 0);
        doc.text(label, margin, cursorY);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);

        const textLines = doc.splitTextToSize(msg.content, maxLineWidth);

        if (cursorY + textLines.length * 7 > 270) {
            doc.addPage();
            cursorY = 20;
        }

        doc.text(textLines, margin, cursorY + 6);
        cursorY += textLines.length * 6 + 12;
    });

    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `Page ${i} of ${pageCount} - Sinofetch (PVT) LTD - www.sinofetch.com`,
            pageWidth / 2,
            285,
            { align: "center" }
        );
    }

    doc.save(`Sinofetch_Transcript_${userName.replace(/\s+/g, "_")}.pdf`);
};
