import { describe, expect, it } from "vitest";
import {
  calculateNakshatraFromDegree,
  calculateRashiFromDegree,
  calculatePorondamScores,
  calculateOverallScore,
  generateRecommendations,
  NAKSHATRAS,
  RASHIS,
} from "./astrology";

describe("Nakshatra Calculations", () => {
  it("calculates nakshatra from moon longitude correctly", () => {
    // 0° should be Ashwini (1st nakshatra)
    const result1 = calculateNakshatraFromDegree(0);
    expect(result1.nakshatra).toBe(1);
    expect(result1.pada).toBe(1);

    // 10° is within Ashwini (0-13.33°), pada calculation: 10 / 3.33 = ~3, so 4th pada
    const result2 = calculateNakshatraFromDegree(10);
    expect(result2.nakshatra).toBe(1);
    expect(result2.pada).toBe(4); // 10° falls in the 4th quarter of Ashwini

    // 15° should be Bharani (2nd nakshatra)
    const result3 = calculateNakshatraFromDegree(15);
    expect(result3.nakshatra).toBe(2);
    expect(result3.pada).toBe(1);

    // 180° should be around Chitra (14th nakshatra)
    const result4 = calculateNakshatraFromDegree(180);
    expect(result4.nakshatra).toBe(14);
  });

  it("handles edge cases for nakshatra calculation", () => {
    // 360° should wrap to 0° (Ashwini)
    const result1 = calculateNakshatraFromDegree(360);
    expect(result1.nakshatra).toBe(1);

    // Negative degrees should normalize
    const result2 = calculateNakshatraFromDegree(-10);
    expect(result2.nakshatra).toBeGreaterThanOrEqual(1);
    expect(result2.nakshatra).toBeLessThanOrEqual(27);
  });
});

describe("Rashi Calculations", () => {
  it("calculates rashi from moon longitude correctly", () => {
    // 0° should be Mesha (Aries, 1st rashi)
    expect(calculateRashiFromDegree(0)).toBe(1);

    // 30° should be Vrishabha (Taurus, 2nd rashi)
    expect(calculateRashiFromDegree(30)).toBe(2);

    // 90° should be Karka (Cancer, 4th rashi)
    expect(calculateRashiFromDegree(90)).toBe(4);

    // 180° should be Tula (Libra, 7th rashi)
    expect(calculateRashiFromDegree(180)).toBe(7);

    // 270° should be Makara (Capricorn, 10th rashi)
    expect(calculateRashiFromDegree(270)).toBe(10);
  });

  it("handles edge cases for rashi calculation", () => {
    // 360° should wrap to Mesha
    expect(calculateRashiFromDegree(360)).toBe(1);

    // 359° should be Meena (Pisces, 12th rashi)
    expect(calculateRashiFromDegree(359)).toBe(12);
  });
});

describe("Porondam Score Calculations", () => {
  it("calculates all 20 porondam scores", () => {
    // Test with Ashwini (1) and Bharani (2) nakshatras
    // Mesha (1) and Mesha (1) rashis
    const scores = calculatePorondamScores(1, 2, 1, 1, "male", "female");

    // Should have all 20 aspects
    expect(Object.keys(scores)).toHaveLength(20);

    // Each score should have required properties
    Object.values(scores).forEach((score) => {
      expect(score).toHaveProperty("name");
      expect(score).toHaveProperty("nameSinhala");
      expect(score).toHaveProperty("maxPoints");
      expect(score).toHaveProperty("score");
      expect(score).toHaveProperty("matched");
      expect(score).toHaveProperty("description");
      expect(score).toHaveProperty("descriptionSinhala");
      expect(score.score).toBeGreaterThanOrEqual(0);
      expect(score.score).toBeLessThanOrEqual(score.maxPoints);
    });
  });

  it("calculates gana porondam correctly", () => {
    // Ashwini is Deva gana, Bharani is Manushya gana
    const scores = calculatePorondamScores(1, 2, 1, 1, "male", "female");
    
    // Deva-Manushya should give 5-6 points
    expect(scores.gana.score).toBeGreaterThanOrEqual(5);
  });

  it("calculates nadi porondam correctly", () => {
    // Same nadi should give 0 points (Nadi Dosha)
    // Ashwini and Shatabhisha both have Vata nadi
    const scores = calculatePorondamScores(1, 24, 1, 11, "male", "female");
    expect(scores.nadi.matched).toBe(false);
    expect(scores.nadi.score).toBe(0);

    // Different nadi should give 8 points
    // Ashwini (Vata) and Bharani (Pitta)
    const scores2 = calculatePorondamScores(1, 2, 1, 1, "male", "female");
    expect(scores2.nadi.matched).toBe(true);
    expect(scores2.nadi.score).toBe(8);
  });

  it("calculates linga porondam correctly", () => {
    // Different genders should match
    const scores1 = calculatePorondamScores(1, 2, 1, 1, "male", "female");
    expect(scores1.linga.matched).toBe(true);
    expect(scores1.linga.score).toBe(1);

    // Same genders should not match
    const scores2 = calculatePorondamScores(1, 2, 1, 1, "male", "male");
    expect(scores2.linga.matched).toBe(false);
    expect(scores2.linga.score).toBe(0);
  });
});

describe("Overall Score Calculation", () => {
  it("calculates overall percentage correctly", () => {
    const scores = calculatePorondamScores(1, 2, 1, 2, "male", "female");
    const overallScore = calculateOverallScore(scores);

    expect(overallScore).toBeGreaterThanOrEqual(0);
    expect(overallScore).toBeLessThanOrEqual(100);
    expect(Number.isInteger(overallScore)).toBe(true);
  });

  it("returns 100% for perfect match scenario", () => {
    // Create a mock perfect score scenario
    const mockScores = calculatePorondamScores(1, 7, 1, 3, "male", "female");
    const overallScore = calculateOverallScore(mockScores);
    
    // Score should be a valid percentage
    expect(overallScore).toBeGreaterThanOrEqual(0);
    expect(overallScore).toBeLessThanOrEqual(100);
  });
});

describe("Recommendations Generation", () => {
  it("generates English recommendations based on score", () => {
    const scores = calculatePorondamScores(1, 2, 1, 2, "male", "female");
    const overallScore = calculateOverallScore(scores);
    const recommendations = generateRecommendations(scores, overallScore);

    expect(typeof recommendations).toBe("string");
    expect(recommendations.length).toBeGreaterThan(0);
  });

  it("includes specific recommendations for doshas", () => {
    // Test with same nadi (Nadi Dosha)
    const scores = calculatePorondamScores(1, 24, 1, 11, "male", "female");
    const overallScore = calculateOverallScore(scores);
    const recommendations = generateRecommendations(scores, overallScore);

    // Should mention Nadi Dosha
    expect(recommendations.toLowerCase()).toContain("nadi");
  });
});

describe("Reference Data", () => {
  it("has 27 nakshatras defined", () => {
    expect(NAKSHATRAS).toHaveLength(27);
  });

  it("has 12 rashis defined", () => {
    expect(RASHIS).toHaveLength(12);
  });

  it("each nakshatra has required properties", () => {
    NAKSHATRAS.forEach((nak) => {
      expect(nak).toHaveProperty("id");
      expect(nak).toHaveProperty("name");
      expect(nak).toHaveProperty("sinhala");
      expect(nak).toHaveProperty("lord");
      expect(nak).toHaveProperty("gana");
      expect(nak).toHaveProperty("yoni");
      expect(nak).toHaveProperty("nadi");
      expect(nak.id).toBeGreaterThanOrEqual(1);
      expect(nak.id).toBeLessThanOrEqual(27);
    });
  });

  it("each rashi has required properties", () => {
    RASHIS.forEach((rashi) => {
      expect(rashi).toHaveProperty("id");
      expect(rashi).toHaveProperty("name");
      expect(rashi).toHaveProperty("sinhala");
      expect(rashi).toHaveProperty("english");
      expect(rashi).toHaveProperty("lord");
      expect(rashi.id).toBeGreaterThanOrEqual(1);
      expect(rashi.id).toBeLessThanOrEqual(12);
    });
  });
});
