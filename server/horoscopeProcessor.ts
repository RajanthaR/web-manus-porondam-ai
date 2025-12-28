/**
 * Horoscope Chart Image Processing using GPT-4 Vision
 * Extracts birth details and planetary positions from handwritten Sinhala charts
 */

import { invokeLLM } from "./_core/llm";
import { calculateNakshatraFromDegree, calculateRashiFromDegree, NAKSHATRAS, RASHIS } from "./astrology";
import type { PlanetaryPositions } from "../drizzle/schema";

export interface ExtractedHoroscopeData {
  personName?: string;
  gender?: "male" | "female";
  birthDate?: Date;
  birthTime?: string;
  birthPlace?: string;
  nakshatra?: number;
  nakshatraPada?: number;
  rashi?: number;
  planetaryPositions?: PlanetaryPositions;
  rawExtractedText?: string;
  confidence: number;
  errors?: string[];
}

/**
 * Extract horoscope data from an image using GPT-4 Vision
 */
export async function extractHoroscopeFromImage(imageUrl: string): Promise<ExtractedHoroscopeData> {
  const systemPrompt = `You are an expert Vedic astrologer who can read handwritten Sinhala (Sri Lankan) horoscope charts.
Your task is to extract birth details and planetary positions from the horoscope chart image.

A traditional Sinhala horoscope chart typically contains:
1. Birth details: Date (දිනය), Time (වේලාව), Place (ස්ථානය)
2. Person's name (නම) and sometimes gender
3. A square chart divided into 12 houses (භාව) showing planetary positions
4. Nakshatra (නැකත) - birth star
5. Rashi (රාශිය) - moon sign/zodiac sign
6. Planetary positions for: Sun (රවි), Moon (චන්ද්‍ර), Mars (කුජ), Mercury (බුධ), Jupiter (ගුරු), Venus (සිකුරු), Saturn (ශනි), Rahu (රාහු), Ketu (කේතු)

The 12 houses are arranged in a specific pattern. Each house corresponds to a zodiac sign.
Planets are indicated by their Sinhala abbreviations or symbols.

Extract all available information and return it in the specified JSON format.`;

  const userPrompt = `Please analyze this horoscope chart image and extract the following information:

1. Person's name (if visible)
2. Gender (if indicated or inferable)
3. Birth date (in YYYY-MM-DD format if possible)
4. Birth time (in HH:MM format, 24-hour)
5. Birth place
6. Nakshatra (birth star) - identify by name or number (1-27)
7. Nakshatra Pada (quarter) - 1 to 4
8. Rashi (moon sign) - identify by name or number (1-12)
9. Planetary positions - for each planet, identify which house/sign it's in

The 27 Nakshatras are: 1-Ashwini, 2-Bharani, 3-Krittika, 4-Rohini, 5-Mrigashira, 6-Ardra, 7-Punarvasu, 8-Pushya, 9-Ashlesha, 10-Magha, 11-Purva Phalguni, 12-Uttara Phalguni, 13-Hasta, 14-Chitra, 15-Swati, 16-Vishakha, 17-Anuradha, 18-Jyeshtha, 19-Mula, 20-Purva Ashadha, 21-Uttara Ashadha, 22-Shravana, 23-Dhanishta, 24-Shatabhisha, 25-Purva Bhadrapada, 26-Uttara Bhadrapada, 27-Revati

The 12 Rashis are: 1-Mesha/Aries, 2-Vrishabha/Taurus, 3-Mithuna/Gemini, 4-Karka/Cancer, 5-Simha/Leo, 6-Kanya/Virgo, 7-Tula/Libra, 8-Vrishchika/Scorpio, 9-Dhanus/Sagittarius, 10-Makara/Capricorn, 11-Kumbha/Aquarius, 12-Meena/Pisces

Return your analysis as JSON with the following structure. Use null for any fields you cannot determine.`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: [
            { type: "text", text: userPrompt },
            { type: "image_url", image_url: { url: imageUrl, detail: "high" } }
          ]
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "horoscope_extraction",
          strict: true,
          schema: {
            type: "object",
            properties: {
              personName: { type: ["string", "null"], description: "Name of the person" },
              gender: { type: ["string", "null"], enum: ["male", "female", null], description: "Gender if identifiable" },
              birthDate: { type: ["string", "null"], description: "Birth date in YYYY-MM-DD format" },
              birthTime: { type: ["string", "null"], description: "Birth time in HH:MM format" },
              birthPlace: { type: ["string", "null"], description: "Birth place name" },
              nakshatra: { type: ["integer", "null"], description: "Nakshatra number 1-27" },
              nakshatraPada: { type: ["integer", "null"], description: "Nakshatra pada 1-4" },
              rashi: { type: ["integer", "null"], description: "Rashi number 1-12" },
              moonLongitude: { type: ["number", "null"], description: "Moon's longitude in degrees if calculable" },
              planetaryPositions: {
                type: ["object", "null"],
                properties: {
                  sun: { type: ["object", "null"], properties: { sign: { type: "integer" }, house: { type: "integer" } }, required: ["sign", "house"], additionalProperties: false },
                  moon: { type: ["object", "null"], properties: { sign: { type: "integer" }, house: { type: "integer" } }, required: ["sign", "house"], additionalProperties: false },
                  mars: { type: ["object", "null"], properties: { sign: { type: "integer" }, house: { type: "integer" } }, required: ["sign", "house"], additionalProperties: false },
                  mercury: { type: ["object", "null"], properties: { sign: { type: "integer" }, house: { type: "integer" } }, required: ["sign", "house"], additionalProperties: false },
                  jupiter: { type: ["object", "null"], properties: { sign: { type: "integer" }, house: { type: "integer" } }, required: ["sign", "house"], additionalProperties: false },
                  venus: { type: ["object", "null"], properties: { sign: { type: "integer" }, house: { type: "integer" } }, required: ["sign", "house"], additionalProperties: false },
                  saturn: { type: ["object", "null"], properties: { sign: { type: "integer" }, house: { type: "integer" } }, required: ["sign", "house"], additionalProperties: false },
                  rahu: { type: ["object", "null"], properties: { sign: { type: "integer" }, house: { type: "integer" } }, required: ["sign", "house"], additionalProperties: false },
                  ketu: { type: ["object", "null"], properties: { sign: { type: "integer" }, house: { type: "integer" } }, required: ["sign", "house"], additionalProperties: false },
                },
                required: [],
                additionalProperties: false
              },
              rawText: { type: ["string", "null"], description: "Any raw text visible in the chart" },
              confidence: { type: "number", description: "Confidence score 0-100" },
              notes: { type: ["string", "null"], description: "Any additional observations" }
            },
            required: ["confidence"],
            additionalProperties: false
          }
        }
      }
    });

    const messageContent = response.choices[0]?.message?.content;
    if (!messageContent) {
      throw new Error("No response from vision model");
    }

    const contentStr = typeof messageContent === 'string' ? messageContent : JSON.stringify(messageContent);
    const extracted = JSON.parse(contentStr);
    
    // Process and validate the extracted data
    const result: ExtractedHoroscopeData = {
      personName: extracted.personName || undefined,
      gender: extracted.gender || undefined,
      birthTime: extracted.birthTime || undefined,
      birthPlace: extracted.birthPlace || undefined,
      rawExtractedText: extracted.rawText || undefined,
      confidence: extracted.confidence || 0,
      errors: [],
    };

    // Parse birth date
    if (extracted.birthDate) {
      try {
        result.birthDate = new Date(extracted.birthDate);
      } catch {
        result.errors?.push("Could not parse birth date");
      }
    }

    // Handle nakshatra - either from direct extraction or calculation
    if (extracted.nakshatra && extracted.nakshatra >= 1 && extracted.nakshatra <= 27) {
      result.nakshatra = extracted.nakshatra;
      result.nakshatraPada = extracted.nakshatraPada || 1;
    } else if (extracted.moonLongitude) {
      const calc = calculateNakshatraFromDegree(extracted.moonLongitude);
      result.nakshatra = calc.nakshatra;
      result.nakshatraPada = calc.pada;
    }

    // Handle rashi
    if (extracted.rashi && extracted.rashi >= 1 && extracted.rashi <= 12) {
      result.rashi = extracted.rashi;
    } else if (extracted.moonLongitude) {
      result.rashi = calculateRashiFromDegree(extracted.moonLongitude);
    } else if (result.nakshatra) {
      // Approximate rashi from nakshatra
      result.rashi = Math.ceil((result.nakshatra * 12) / 27);
    }

    // Process planetary positions
    if (extracted.planetaryPositions) {
      result.planetaryPositions = {};
      const planets = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'] as const;
      
      for (const planet of planets) {
        const pos = extracted.planetaryPositions[planet];
        if (pos && pos.sign >= 1 && pos.sign <= 12) {
          result.planetaryPositions[planet] = {
            sign: pos.sign,
            degree: 0,
            house: pos.house || pos.sign
          };
        }
      }
    }

    return result;

  } catch (error) {
    console.error("Error extracting horoscope data:", error);
    return {
      confidence: 0,
      errors: [`Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}

/**
 * Validate extracted horoscope data
 */
export function validateHoroscopeData(data: ExtractedHoroscopeData): { valid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];
  
  if (!data.nakshatra) missingFields.push("Nakshatra (birth star)");
  if (!data.rashi) missingFields.push("Rashi (moon sign)");
  if (!data.gender) missingFields.push("Gender");
  
  return {
    valid: missingFields.length === 0,
    missingFields
  };
}

/**
 * Get nakshatra name by ID
 */
export function getNakshatraName(id: number): { english: string; sinhala: string } | null {
  const nak = NAKSHATRAS.find(n => n.id === id);
  return nak ? { english: nak.name, sinhala: nak.sinhala } : null;
}

/**
 * Get rashi name by ID
 */
export function getRashiName(id: number): { sanskrit: string; english: string; sinhala: string } | null {
  const rash = RASHIS.find(r => r.id === id);
  return rash ? { sanskrit: rash.name, english: rash.english, sinhala: rash.sinhala } : null;
}
