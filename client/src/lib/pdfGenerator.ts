import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PorondamScore {
  name: string;
  nameSinhala: string;
  maxPoints: number;
  score: number;
  matched: boolean;
  description: string;
  descriptionSinhala: string;
}

interface MatchResult {
  overallScore: number;
  totalPoints: number;
  maxPoints: number;
  matchedCount: number;
  totalAspects: number;
  scores: Record<string, PorondamScore>;
  recommendations: string;
  recommendationsSinhala: string;
}

interface PersonInfo {
  name?: string;
  gender: string;
  nakshatra: number;
  nakshatraName: string;
  pada: number;
  rashi: number;
  rashiName: string;
}

interface PDFReportData {
  person1: PersonInfo;
  person2: PersonInfo;
  result: MatchResult;
  createdAt: Date;
}

export function generateCompatibilityPDF(data: PDFReportData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // Header with gradient effect (simulated with colored rectangles)
  doc.setFillColor(124, 58, 237); // Purple
  doc.rect(0, 0, pageWidth, 45, "F");
  
  // Logo and title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Porondam.ai", pageWidth / 2, 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Horoscope Compatibility Report", pageWidth / 2, 32, { align: "center" });
  
  yPos = 55;

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Overall Score Section
  const scoreColor = getScoreColor(data.result.overallScore);
  doc.setFillColor(scoreColor.r, scoreColor.g, scoreColor.b);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 35, 5, 5, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(`${data.result.overallScore}%`, pageWidth / 2, yPos + 18, { align: "center" });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const matchLabel = getMatchLabel(data.result.overallScore);
  doc.text(matchLabel, pageWidth / 2, yPos + 28, { align: "center" });
  
  yPos += 45;

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Person Details Section
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Match Details", margin, yPos);
  yPos += 10;

  // Person 1 and Person 2 side by side
  const colWidth = (pageWidth - 2 * margin - 10) / 2;
  
  // Person 1 Box
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(margin, yPos, colWidth, 45, 3, 3, "F");
  doc.setDrawColor(124, 58, 237);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPos, colWidth, 45, 3, 3, "S");
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(124, 58, 237);
  doc.text(data.person1.name || "Person 1", margin + 5, yPos + 10);
  
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Gender: ${data.person1.gender === "male" ? "Male" : "Female"}`, margin + 5, yPos + 20);
  doc.text(`Nakshatra: ${data.person1.nakshatraName} (Pada ${data.person1.pada})`, margin + 5, yPos + 28);
  doc.text(`Rashi: ${data.person1.rashiName}`, margin + 5, yPos + 36);

  // Person 2 Box
  const person2X = margin + colWidth + 10;
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(person2X, yPos, colWidth, 45, 3, 3, "F");
  doc.setDrawColor(234, 88, 12);
  doc.roundedRect(person2X, yPos, colWidth, 45, 3, 3, "S");
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(234, 88, 12);
  doc.text(data.person2.name || "Person 2", person2X + 5, yPos + 10);
  
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Gender: ${data.person2.gender === "male" ? "Male" : "Female"}`, person2X + 5, yPos + 20);
  doc.text(`Nakshatra: ${data.person2.nakshatraName} (Pada ${data.person2.pada})`, person2X + 5, yPos + 28);
  doc.text(`Rashi: ${data.person2.rashiName}`, person2X + 5, yPos + 36);

  yPos += 55;

  // Summary Stats
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.result.matchedCount} of ${data.result.totalAspects} aspects matched  •  ${data.result.totalPoints}/${data.result.maxPoints} points`, pageWidth / 2, yPos, { align: "center" });
  
  yPos += 15;

  // Detailed Scores Table
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("20 Porondam Analysis", margin, yPos);
  yPos += 5;

  const tableData = Object.entries(data.result.scores).map(([key, score]) => [
    score.name,
    score.matched ? "✓" : "✗",
    `${score.score}/${score.maxPoints}`,
    score.description.substring(0, 50) + (score.description.length > 50 ? "..." : ""),
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Aspect", "Status", "Score", "Description"]],
    body: tableData,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [124, 58, 237],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 35, fontStyle: "bold" },
      1: { cellWidth: 15, halign: "center" },
      2: { cellWidth: 20, halign: "center" },
      3: { cellWidth: "auto" },
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    didParseCell: function (data) {
      if (data.column.index === 1 && data.section === "body") {
        if (data.cell.raw === "✓") {
          data.cell.styles.textColor = [34, 197, 94]; // Green
          data.cell.styles.fontStyle = "bold";
        } else {
          data.cell.styles.textColor = [239, 68, 68]; // Red
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  // Get the final Y position after the table
  const finalY = (doc as any).lastAutoTable.finalY || yPos + 100;
  yPos = finalY + 15;

  // Check if we need a new page for recommendations
  if (yPos > doc.internal.pageSize.getHeight() - 60) {
    doc.addPage();
    yPos = 20;
  }

  // Recommendations Section
  doc.setFillColor(254, 249, 195); // Light yellow
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 40, 3, 3, "F");
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(161, 98, 7);
  doc.text("Recommendations", margin + 5, yPos + 10);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  
  // Word wrap recommendations
  const splitRecommendations = doc.splitTextToSize(data.result.recommendations, pageWidth - 2 * margin - 10);
  doc.text(splitRecommendations.slice(0, 3), margin + 5, yPos + 20);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Generated by Porondam.ai on ${data.createdAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    pageWidth / 2,
    footerY,
    { align: "center" }
  );
  doc.text(
    "This report is for informational purposes only. Please consult a qualified astrologer for important decisions.",
    pageWidth / 2,
    footerY + 5,
    { align: "center" }
  );

  return doc;
}

function getScoreColor(score: number): { r: number; g: number; b: number } {
  if (score >= 70) return { r: 34, g: 197, b: 94 }; // Green
  if (score >= 50) return { r: 234, g: 179, b: 8 }; // Yellow
  if (score >= 30) return { r: 249, g: 115, b: 22 }; // Orange
  return { r: 239, g: 68, b: 68 }; // Red
}

function getMatchLabel(score: number): string {
  if (score >= 70) return "Excellent Match";
  if (score >= 50) return "Good Match";
  if (score >= 30) return "Moderate Match";
  return "Challenging Match";
}

export function downloadPDF(doc: jsPDF, filename: string): void {
  doc.save(filename);
}
