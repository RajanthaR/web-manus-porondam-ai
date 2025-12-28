import { describe, expect, it, vi } from "vitest";
import { generateCompatibilityPDF } from "./pdfGenerator";

// Mock jsPDF
vi.mock("jspdf", () => {
  const mockDoc = {
    internal: {
      pageSize: {
        getWidth: () => 210,
        getHeight: () => 297,
      },
    },
    setFillColor: vi.fn(),
    rect: vi.fn(),
    roundedRect: vi.fn(),
    setTextColor: vi.fn(),
    setFontSize: vi.fn(),
    setFont: vi.fn(),
    text: vi.fn(),
    setDrawColor: vi.fn(),
    setLineWidth: vi.fn(),
    splitTextToSize: vi.fn((text: string) => [text]),
    addPage: vi.fn(),
    save: vi.fn(),
    lastAutoTable: { finalY: 200 },
  };
  return {
    default: vi.fn(() => mockDoc),
  };
});

vi.mock("jspdf-autotable", () => ({
  default: vi.fn(),
}));

describe("PDF Generator", () => {
  const mockPDFData = {
    person1: {
      name: "John",
      gender: "male",
      nakshatra: 1,
      nakshatraName: "Ashwini",
      pada: 1,
      rashi: 1,
      rashiName: "Mesha (Aries)",
    },
    person2: {
      name: "Jane",
      gender: "female",
      nakshatra: 4,
      nakshatraName: "Rohini",
      pada: 2,
      rashi: 2,
      rashiName: "Vrishabha (Taurus)",
    },
    result: {
      overallScore: 75,
      totalPoints: 42,
      maxPoints: 54,
      matchedCount: 16,
      totalAspects: 20,
      scores: {
        nadi: {
          name: "Nadi Porondam",
          nameSinhala: "නාඩි පොරොන්දම",
          maxPoints: 8,
          score: 8,
          matched: true,
          description: "Different nadis - excellent health compatibility",
          descriptionSinhala: "විවිධ නාඩි - විශිෂ්ට සෞඛ්‍ය ගැලපීම",
        },
        gana: {
          name: "Gana Porondam",
          nameSinhala: "ගණ පොරොන්දම",
          maxPoints: 6,
          score: 6,
          matched: true,
          description: "Temperaments are well matched",
          descriptionSinhala: "ස්වභාවයන් හොඳින් ගැලපේ",
        },
      },
      recommendations: "This is an excellent match with strong compatibility.",
      recommendationsSinhala: "මෙය ශක්තිමත් ගැලපීමක් සහිත විශිෂ්ට ගැලපීමකි.",
    },
    createdAt: new Date("2024-01-15"),
  };

  it("generates a PDF document without errors", () => {
    const doc = generateCompatibilityPDF(mockPDFData);
    expect(doc).toBeDefined();
  });

  it("calls jsPDF methods to create the document structure", () => {
    const doc = generateCompatibilityPDF(mockPDFData);
    
    // Verify that text was added (header, scores, etc.)
    expect(doc.text).toHaveBeenCalled();
    expect(doc.setFontSize).toHaveBeenCalled();
    expect(doc.setFont).toHaveBeenCalled();
  });

  it("handles missing person names gracefully", () => {
    const dataWithoutNames = {
      ...mockPDFData,
      person1: { ...mockPDFData.person1, name: undefined },
      person2: { ...mockPDFData.person2, name: undefined },
    };
    
    expect(() => generateCompatibilityPDF(dataWithoutNames)).not.toThrow();
  });

  it("handles different score ranges correctly", () => {
    // Test with low score
    const lowScoreData = {
      ...mockPDFData,
      result: { ...mockPDFData.result, overallScore: 25 },
    };
    expect(() => generateCompatibilityPDF(lowScoreData)).not.toThrow();

    // Test with medium score
    const mediumScoreData = {
      ...mockPDFData,
      result: { ...mockPDFData.result, overallScore: 55 },
    };
    expect(() => generateCompatibilityPDF(mediumScoreData)).not.toThrow();

    // Test with high score
    const highScoreData = {
      ...mockPDFData,
      result: { ...mockPDFData.result, overallScore: 85 },
    };
    expect(() => generateCompatibilityPDF(highScoreData)).not.toThrow();
  });

  it("includes all required sections in the PDF", () => {
    const doc = generateCompatibilityPDF(mockPDFData);
    
    // Check that header text was added
    expect(doc.text).toHaveBeenCalledWith(
      "Porondam.ai",
      expect.any(Number),
      expect.any(Number),
      expect.any(Object)
    );
    
    // Check that score percentage was added
    expect(doc.text).toHaveBeenCalledWith(
      "75%",
      expect.any(Number),
      expect.any(Number),
      expect.any(Object)
    );
  });
});
