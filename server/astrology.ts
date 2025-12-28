/**
 * Vedic Astrology Calculations for Porondam Matching
 * Based on traditional Sinhalese/South Indian astrology system
 */

import type { PorondamScore, PorondamScores } from "../drizzle/schema";

// 27 Nakshatras with their properties
export const NAKSHATRAS = [
  { id: 1, name: "Ashwini", sinhala: "අස්විද", lord: "Ketu", gana: "Deva", yoni: "Horse", yoniGender: "Male", nadi: "Vata" },
  { id: 2, name: "Bharani", sinhala: "බෙරණ", lord: "Venus", gana: "Manushya", yoni: "Elephant", yoniGender: "Female", nadi: "Pitta" },
  { id: 3, name: "Krittika", sinhala: "කැති", lord: "Sun", gana: "Rakshasa", yoni: "Sheep", yoniGender: "Female", nadi: "Kapha" },
  { id: 4, name: "Rohini", sinhala: "රෙහෙණ", lord: "Moon", gana: "Manushya", yoni: "Serpent", yoniGender: "Male", nadi: "Kapha" },
  { id: 5, name: "Mrigashira", sinhala: "මුවසිරස", lord: "Mars", gana: "Deva", yoni: "Serpent", yoniGender: "Female", nadi: "Kapha" },
  { id: 6, name: "Ardra", sinhala: "අද", lord: "Rahu", gana: "Manushya", yoni: "Dog", yoniGender: "Female", nadi: "Vata" },
  { id: 7, name: "Punarvasu", sinhala: "පුනාවස", lord: "Jupiter", gana: "Deva", yoni: "Cat", yoniGender: "Male", nadi: "Vata" },
  { id: 8, name: "Pushya", sinhala: "පුස", lord: "Saturn", gana: "Deva", yoni: "Goat", yoniGender: "Male", nadi: "Pitta" },
  { id: 9, name: "Ashlesha", sinhala: "අස්ලිස", lord: "Mercury", gana: "Rakshasa", yoni: "Cat", yoniGender: "Female", nadi: "Kapha" },
  { id: 10, name: "Magha", sinhala: "මා", lord: "Ketu", gana: "Rakshasa", yoni: "Rat", yoniGender: "Male", nadi: "Kapha" },
  { id: 11, name: "Purva Phalguni", sinhala: "පුවපල්", lord: "Venus", gana: "Manushya", yoni: "Rat", yoniGender: "Female", nadi: "Pitta" },
  { id: 12, name: "Uttara Phalguni", sinhala: "උත්‍රපල්", lord: "Sun", gana: "Manushya", yoni: "Cow", yoniGender: "Male", nadi: "Vata" },
  { id: 13, name: "Hasta", sinhala: "හත", lord: "Moon", gana: "Deva", yoni: "Buffalo", yoniGender: "Female", nadi: "Vata" },
  { id: 14, name: "Chitra", sinhala: "සිත", lord: "Mars", gana: "Rakshasa", yoni: "Tiger", yoniGender: "Female", nadi: "Pitta" },
  { id: 15, name: "Swati", sinhala: "සා", lord: "Rahu", gana: "Deva", yoni: "Buffalo", yoniGender: "Male", nadi: "Kapha" },
  { id: 16, name: "Vishakha", sinhala: "විසා", lord: "Jupiter", gana: "Rakshasa", yoni: "Tiger", yoniGender: "Male", nadi: "Kapha" },
  { id: 17, name: "Anuradha", sinhala: "අනුර", lord: "Saturn", gana: "Deva", yoni: "Deer", yoniGender: "Female", nadi: "Pitta" },
  { id: 18, name: "Jyeshtha", sinhala: "දෙට", lord: "Mercury", gana: "Rakshasa", yoni: "Deer", yoniGender: "Male", nadi: "Vata" },
  { id: 19, name: "Mula", sinhala: "මුල", lord: "Ketu", gana: "Rakshasa", yoni: "Dog", yoniGender: "Male", nadi: "Vata" },
  { id: 20, name: "Purva Ashadha", sinhala: "පුවසල", lord: "Venus", gana: "Manushya", yoni: "Monkey", yoniGender: "Male", nadi: "Pitta" },
  { id: 21, name: "Uttara Ashadha", sinhala: "උත්‍රසල", lord: "Sun", gana: "Manushya", yoni: "Mongoose", yoniGender: "Male", nadi: "Kapha" },
  { id: 22, name: "Shravana", sinhala: "සවන", lord: "Moon", gana: "Deva", yoni: "Monkey", yoniGender: "Female", nadi: "Kapha" },
  { id: 23, name: "Dhanishta", sinhala: "දනිට", lord: "Mars", gana: "Rakshasa", yoni: "Lion", yoniGender: "Female", nadi: "Pitta" },
  { id: 24, name: "Shatabhisha", sinhala: "සියාවස", lord: "Rahu", gana: "Rakshasa", yoni: "Horse", yoniGender: "Female", nadi: "Vata" },
  { id: 25, name: "Purva Bhadrapada", sinhala: "පුවපුටුප", lord: "Jupiter", gana: "Manushya", yoni: "Lion", yoniGender: "Male", nadi: "Vata" },
  { id: 26, name: "Uttara Bhadrapada", sinhala: "උත්‍රපුටුප", lord: "Saturn", gana: "Manushya", yoni: "Cow", yoniGender: "Female", nadi: "Pitta" },
  { id: 27, name: "Revati", sinhala: "රේවති", lord: "Mercury", gana: "Deva", yoni: "Elephant", yoniGender: "Male", nadi: "Kapha" },
];

// 12 Rashis (Zodiac Signs)
export const RASHIS = [
  { id: 1, name: "Mesha", sinhala: "මේෂ", english: "Aries", lord: "Mars" },
  { id: 2, name: "Vrishabha", sinhala: "වෘෂභ", english: "Taurus", lord: "Venus" },
  { id: 3, name: "Mithuna", sinhala: "මිථුන", english: "Gemini", lord: "Mercury" },
  { id: 4, name: "Karka", sinhala: "කටක", english: "Cancer", lord: "Moon" },
  { id: 5, name: "Simha", sinhala: "සිංහ", english: "Leo", lord: "Sun" },
  { id: 6, name: "Kanya", sinhala: "කන්‍යා", english: "Virgo", lord: "Mercury" },
  { id: 7, name: "Tula", sinhala: "තුලා", english: "Libra", lord: "Venus" },
  { id: 8, name: "Vrishchika", sinhala: "වෘශ්චික", english: "Scorpio", lord: "Mars" },
  { id: 9, name: "Dhanus", sinhala: "ධනු", english: "Sagittarius", lord: "Jupiter" },
  { id: 10, name: "Makara", sinhala: "මකර", english: "Capricorn", lord: "Saturn" },
  { id: 11, name: "Kumbha", sinhala: "කුම්භ", english: "Aquarius", lord: "Saturn" },
  { id: 12, name: "Meena", sinhala: "මීන", english: "Pisces", lord: "Jupiter" },
];

// Yoni compatibility matrix (4 = same, 3 = friendly, 2 = neutral, 1 = enemy, 0 = sworn enemy)
const YONI_COMPATIBILITY: Record<string, Record<string, number>> = {
  Horse: { Horse: 4, Elephant: 2, Sheep: 2, Serpent: 2, Dog: 2, Cat: 2, Rat: 2, Cow: 1, Buffalo: 0, Tiger: 1, Deer: 3, Monkey: 2, Mongoose: 2, Lion: 1 },
  Elephant: { Horse: 2, Elephant: 4, Sheep: 3, Serpent: 2, Dog: 2, Cat: 2, Rat: 2, Cow: 2, Buffalo: 2, Tiger: 1, Deer: 2, Monkey: 2, Mongoose: 2, Lion: 0 },
  Sheep: { Horse: 2, Elephant: 3, Sheep: 4, Serpent: 2, Dog: 2, Cat: 2, Rat: 2, Cow: 2, Buffalo: 2, Tiger: 1, Deer: 2, Monkey: 0, Mongoose: 2, Lion: 1 },
  Serpent: { Horse: 2, Elephant: 2, Sheep: 2, Serpent: 4, Dog: 2, Cat: 2, Rat: 2, Cow: 1, Buffalo: 2, Tiger: 2, Deer: 2, Monkey: 2, Mongoose: 0, Lion: 2 },
  Dog: { Horse: 2, Elephant: 2, Sheep: 2, Serpent: 2, Dog: 4, Cat: 2, Rat: 2, Cow: 2, Buffalo: 2, Tiger: 2, Deer: 0, Monkey: 2, Mongoose: 2, Lion: 2 },
  Cat: { Horse: 2, Elephant: 2, Sheep: 2, Serpent: 2, Dog: 2, Cat: 4, Rat: 0, Cow: 2, Buffalo: 2, Tiger: 2, Deer: 2, Monkey: 2, Mongoose: 2, Lion: 2 },
  Rat: { Horse: 2, Elephant: 2, Sheep: 2, Serpent: 2, Dog: 2, Cat: 0, Rat: 4, Cow: 2, Buffalo: 2, Tiger: 2, Deer: 2, Monkey: 2, Mongoose: 2, Lion: 2 },
  Cow: { Horse: 1, Elephant: 2, Sheep: 2, Serpent: 1, Dog: 2, Cat: 2, Rat: 2, Cow: 4, Buffalo: 3, Tiger: 0, Deer: 2, Monkey: 2, Mongoose: 2, Lion: 1 },
  Buffalo: { Horse: 0, Elephant: 2, Sheep: 2, Serpent: 2, Dog: 2, Cat: 2, Rat: 2, Cow: 3, Buffalo: 4, Tiger: 1, Deer: 2, Monkey: 2, Mongoose: 2, Lion: 1 },
  Tiger: { Horse: 1, Elephant: 1, Sheep: 1, Serpent: 2, Dog: 2, Cat: 2, Rat: 2, Cow: 0, Buffalo: 1, Tiger: 4, Deer: 1, Monkey: 2, Mongoose: 2, Lion: 2 },
  Deer: { Horse: 3, Elephant: 2, Sheep: 2, Serpent: 2, Dog: 0, Cat: 2, Rat: 2, Cow: 2, Buffalo: 2, Tiger: 1, Deer: 4, Monkey: 2, Mongoose: 2, Lion: 1 },
  Monkey: { Horse: 2, Elephant: 2, Sheep: 0, Serpent: 2, Dog: 2, Cat: 2, Rat: 2, Cow: 2, Buffalo: 2, Tiger: 2, Deer: 2, Monkey: 4, Mongoose: 2, Lion: 2 },
  Mongoose: { Horse: 2, Elephant: 2, Sheep: 2, Serpent: 0, Dog: 2, Cat: 2, Rat: 2, Cow: 2, Buffalo: 2, Tiger: 2, Deer: 2, Monkey: 2, Mongoose: 4, Lion: 2 },
  Lion: { Horse: 1, Elephant: 0, Sheep: 1, Serpent: 2, Dog: 2, Cat: 2, Rat: 2, Cow: 1, Buffalo: 1, Tiger: 2, Deer: 1, Monkey: 2, Mongoose: 2, Lion: 4 },
  Goat: { Horse: 2, Elephant: 3, Sheep: 4, Serpent: 2, Dog: 2, Cat: 2, Rat: 2, Cow: 2, Buffalo: 2, Tiger: 1, Deer: 2, Monkey: 0, Mongoose: 2, Lion: 1, Goat: 4 },
};

// Gana compatibility matrix (max 6 points)
const GANA_COMPATIBILITY: Record<string, Record<string, number>> = {
  Deva: { Deva: 6, Manushya: 5, Rakshasa: 1 },
  Manushya: { Deva: 6, Manushya: 6, Rakshasa: 0 },
  Rakshasa: { Deva: 0, Manushya: 0, Rakshasa: 6 },
};

// Planet friendship matrix for Graha Maitri
const PLANET_FRIENDSHIP: Record<string, Record<string, string>> = {
  Sun: { Moon: "friend", Mars: "friend", Mercury: "neutral", Jupiter: "friend", Venus: "enemy", Saturn: "enemy", Rahu: "enemy", Ketu: "neutral" },
  Moon: { Sun: "friend", Mars: "neutral", Mercury: "neutral", Jupiter: "friend", Venus: "neutral", Saturn: "neutral", Rahu: "enemy", Ketu: "neutral" },
  Mars: { Sun: "friend", Moon: "friend", Mercury: "enemy", Jupiter: "friend", Venus: "neutral", Saturn: "neutral", Rahu: "enemy", Ketu: "neutral" },
  Mercury: { Sun: "neutral", Moon: "enemy", Mars: "neutral", Jupiter: "neutral", Venus: "friend", Saturn: "neutral", Rahu: "neutral", Ketu: "neutral" },
  Jupiter: { Sun: "friend", Moon: "friend", Mars: "friend", Mercury: "neutral", Venus: "enemy", Saturn: "neutral", Rahu: "enemy", Ketu: "neutral" },
  Venus: { Sun: "enemy", Moon: "neutral", Mars: "neutral", Mercury: "friend", Jupiter: "neutral", Saturn: "friend", Rahu: "neutral", Ketu: "neutral" },
  Saturn: { Sun: "enemy", Moon: "enemy", Mars: "enemy", Mercury: "friend", Jupiter: "neutral", Venus: "friend", Rahu: "friend", Ketu: "neutral" },
  Rahu: { Sun: "enemy", Moon: "enemy", Mars: "enemy", Mercury: "neutral", Jupiter: "enemy", Venus: "neutral", Saturn: "friend", Ketu: "neutral" },
  Ketu: { Sun: "neutral", Moon: "neutral", Mars: "neutral", Mercury: "neutral", Jupiter: "neutral", Venus: "neutral", Saturn: "neutral", Rahu: "neutral" },
};

// Rajju (body part) classification
const RAJJU_PARTS = ["Pada", "Kati", "Nabhi", "Kantha", "Shira"]; // Feet, Hip, Navel, Neck, Head
const NAKSHATRA_RAJJU: Record<number, string> = {
  1: "Kantha", 2: "Kati", 3: "Pada", 4: "Shira", 5: "Nabhi",
  6: "Kantha", 7: "Kati", 8: "Pada", 9: "Shira", 10: "Nabhi",
  11: "Kantha", 12: "Kati", 13: "Pada", 14: "Shira", 15: "Nabhi",
  16: "Kantha", 17: "Kati", 18: "Pada", 19: "Shira", 20: "Nabhi",
  21: "Kantha", 22: "Kati", 23: "Pada", 24: "Shira", 25: "Nabhi",
  26: "Kantha", 27: "Kati",
};

// Vedha (obstruction) pairs - these nakshatras should not be paired
const VEDHA_PAIRS: [number, number][] = [
  [1, 18], [2, 17], [3, 16], [4, 15], [5, 23], [6, 22],
  [7, 21], [8, 20], [9, 19], [10, 27], [11, 26], [12, 25],
  [13, 24], [14, 23],
];

/**
 * Calculate Nakshatra from Moon's longitude
 * Each Nakshatra spans 13°20' (13.333...°)
 */
export function calculateNakshatraFromDegree(moonLongitude: number): { nakshatra: number; pada: number } {
  // Normalize to 0-360
  const normalizedDegree = ((moonLongitude % 360) + 360) % 360;
  
  // Each nakshatra is 13°20' = 13.333... degrees
  const nakshatraSpan = 360 / 27;
  const nakshatra = Math.floor(normalizedDegree / nakshatraSpan) + 1;
  
  // Each pada is 3°20' = 3.333... degrees (1/4 of nakshatra)
  const positionInNakshatra = normalizedDegree % nakshatraSpan;
  const pada = Math.floor(positionInNakshatra / (nakshatraSpan / 4)) + 1;
  
  return { nakshatra, pada };
}

/**
 * Calculate Rashi (zodiac sign) from Moon's longitude
 * Each Rashi spans 30°
 */
export function calculateRashiFromDegree(moonLongitude: number): number {
  const normalizedDegree = ((moonLongitude % 360) + 360) % 360;
  return Math.floor(normalizedDegree / 30) + 1;
}

/**
 * Get Nakshatra from Rashi and approximate position
 * Used when only Rashi is known
 */
export function getNakshatraFromRashi(rashi: number, position: "start" | "middle" | "end" = "middle"): number {
  // Each rashi contains approximately 2.25 nakshatras
  const startNakshatra = Math.floor((rashi - 1) * 2.25) + 1;
  
  switch (position) {
    case "start": return startNakshatra;
    case "end": return Math.min(startNakshatra + 2, 27);
    default: return startNakshatra + 1;
  }
}

/**
 * Calculate all 20 Porondam scores
 */
export function calculatePorondamScores(
  nakshatra1: number,
  nakshatra2: number,
  rashi1: number,
  rashi2: number,
  gender1: "male" | "female",
  gender2: "male" | "female"
): PorondamScores {
  const nak1 = NAKSHATRAS[nakshatra1 - 1];
  const nak2 = NAKSHATRAS[nakshatra2 - 1];
  const rash1 = RASHIS[rashi1 - 1];
  const rash2 = RASHIS[rashi2 - 1];

  // Determine bride and groom based on gender
  const brideNak = gender1 === "female" ? nak1 : nak2;
  const groomNak = gender1 === "male" ? nak1 : nak2;
  const brideRashi = gender1 === "female" ? rash1 : rash2;
  const groomRashi = gender1 === "male" ? rash1 : rash2;
  const brideNakNum = gender1 === "female" ? nakshatra1 : nakshatra2;
  const groomNakNum = gender1 === "male" ? nakshatra1 : nakshatra2;

  return {
    nakath: calculateNakathPorondam(brideNakNum, groomNakNum),
    gana: calculateGanaPorondam(brideNak.gana, groomNak.gana),
    mahendra: calculateMahendraPorondam(brideNakNum, groomNakNum),
    streeDeerga: calculateStreeDeergaPorondam(brideNakNum, groomNakNum),
    yoni: calculateYoniPorondam(brideNak.yoni, groomNak.yoni),
    rashi: calculateRashiPorondam(rashi1, rashi2),
    rashiAdhipathi: calculateRashiAdhipathiPorondam(brideRashi.lord, groomRashi.lord),
    vashya: calculateVashyaPorondam(rashi1, rashi2),
    rajju: calculateRajjuPorondam(brideNakNum, groomNakNum),
    vedha: calculateVedhaPorondam(brideNakNum, groomNakNum),
    linga: calculateLingaPorondam(gender1, gender2),
    gotra: calculateGotraPorondam(brideNakNum, groomNakNum),
    varna: calculateVarnaPorondam(rashi1, rashi2),
    vruksha: calculateVrukshaPorondam(brideNakNum, groomNakNum),
    ayusha: calculateAyushaPorondam(brideNakNum, groomNakNum),
    pakshi: calculatePakshiPorondam(brideNakNum, groomNakNum),
    panchaMahaBhutha: calculatePanchaMahaBhuthaPorondam(brideNak.nadi, groomNak.nadi),
    dina: calculateDinaPorondam(brideNakNum, groomNakNum),
    nadi: calculateNadiPorondam(brideNak.nadi, groomNak.nadi),
    graha: calculateGrahaPorondam(brideRashi.lord, groomRashi.lord),
  };
}

// Individual Porondam calculations

function calculateNakathPorondam(brideNak: number, groomNak: number): PorondamScore {
  // Count from bride's nakshatra to groom's
  const count = ((groomNak - brideNak + 27) % 27) + 1;
  // Favorable counts: 1, 3, 5, 7 (odd numbers except 9)
  const favorable = [1, 3, 5, 7, 10, 12, 14, 16, 19, 21, 23, 25];
  const matched = favorable.includes(count);
  
  return {
    name: "Nakath Porondam",
    nameSinhala: "නැකත් පොරොන්දම",
    maxPoints: 3,
    score: matched ? 3 : 0,
    matched,
    description: matched 
      ? "Birth stars are compatible - indicates mental harmony and understanding"
      : "Birth stars show some tension - may require effort for understanding",
    descriptionSinhala: matched
      ? "උපන් නැකත් ගැලපේ - මානසික සමගිය හා අවබෝධය පෙන්නුම් කරයි"
      : "උපන් නැකත් යම් ආතතියක් පෙන්නුම් කරයි - අවබෝධය සඳහා උත්සාහය අවශ්‍ය විය හැක",
  };
}

function calculateGanaPorondam(brideGana: string, groomGana: string): PorondamScore {
  const score = GANA_COMPATIBILITY[brideGana]?.[groomGana] ?? 0;
  const matched = score >= 5;
  
  return {
    name: "Gana Porondam",
    nameSinhala: "ගණ පොරොන්දම",
    maxPoints: 6,
    score,
    matched,
    description: matched
      ? "Temperaments are well matched - indicates harmony in daily life"
      : "Different temperaments - may need adjustment in expectations",
    descriptionSinhala: matched
      ? "ස්වභාවයන් හොඳින් ගැලපේ - දෛනික ජීවිතයේ සමගිය පෙන්නුම් කරයි"
      : "විවිධ ස්වභාවයන් - අපේක්ෂාවන්හි සැකසුම් අවශ්‍ය විය හැක",
  };
}

function calculateMahendraPorondam(brideNak: number, groomNak: number): PorondamScore {
  // Groom's nakshatra should be 4th, 7th, 10th, 13th, 16th, 19th, 22nd, or 25th from bride's
  const count = ((groomNak - brideNak + 27) % 27) + 1;
  const favorable = [4, 7, 10, 13, 16, 19, 22, 25];
  const matched = favorable.includes(count);
  
  return {
    name: "Mahendra Porondam",
    nameSinhala: "මහේන්ද්‍ර පොරොන්දම",
    maxPoints: 1,
    score: matched ? 1 : 0,
    matched,
    description: matched
      ? "Favorable for progeny - indicates healthy and intelligent children"
      : "Neutral for progeny - children's welfare not specifically indicated",
    descriptionSinhala: matched
      ? "දරු සම්පත සඳහා හිතකර - නිරෝගී හා බුද්ධිමත් දරුවන් පෙන්නුම් කරයි"
      : "දරු සම්පත සඳහා මධ්‍යස්ථ - දරුවන්ගේ සුභසාධනය විශේෂයෙන් පෙන්නුම් නොකරයි",
  };
}

function calculateStreeDeergaPorondam(brideNak: number, groomNak: number): PorondamScore {
  // Groom's nakshatra should be at least 13 nakshatras away from bride's
  const count = ((groomNak - brideNak + 27) % 27) + 1;
  const matched = count >= 13;
  
  return {
    name: "Stree Deerga Porondam",
    nameSinhala: "ස්ත්‍රී දීර්ඝ පොරොන්දම",
    maxPoints: 1,
    score: matched ? 1 : 0,
    matched,
    description: matched
      ? "Indicates long and prosperous married life for the wife"
      : "Wife's longevity aspect is neutral",
    descriptionSinhala: matched
      ? "භාර්යාවට දීර්ඝ හා සාර්ථක විවාහ ජීවිතයක් පෙන්නුම් කරයි"
      : "භාර්යාවගේ ආයු අංශය මධ්‍යස්ථ වේ",
  };
}

function calculateYoniPorondam(brideYoni: string, groomYoni: string): PorondamScore {
  const score = YONI_COMPATIBILITY[brideYoni]?.[groomYoni] ?? 2;
  const matched = score >= 3;
  
  return {
    name: "Yoni Porondam",
    nameSinhala: "යෝනි පොරොන්දම",
    maxPoints: 4,
    score,
    matched,
    description: matched
      ? "Physical and intimate compatibility is favorable"
      : "Physical compatibility needs attention and understanding",
    descriptionSinhala: matched
      ? "ශාරීරික හා සමීප ගැලපීම හිතකර වේ"
      : "ශාරීරික ගැලපීම සඳහා අවධානය හා අවබෝධය අවශ්‍ය වේ",
  };
}

function calculateRashiPorondam(rashi1: number, rashi2: number): PorondamScore {
  // Check position of rashis relative to each other
  const diff = Math.abs(rashi1 - rashi2);
  const favorable = [1, 2, 3, 4, 5, 7, 9, 11]; // 2nd, 3rd, 4th, 5th, 6th, 8th, 10th, 12th
  const matched = favorable.includes(diff) || diff === 0;
  
  return {
    name: "Rashi Porondam",
    nameSinhala: "රාශි පොරොන්දම",
    maxPoints: 7,
    score: matched ? 7 : 0,
    matched,
    description: matched
      ? "Moon signs are compatible - indicates emotional harmony"
      : "Moon signs need balancing - emotional adjustment may be needed",
    descriptionSinhala: matched
      ? "චන්ද්‍ර රාශි ගැලපේ - චිත්තවේගීය සමගිය පෙන්නුම් කරයි"
      : "චන්ද්‍ර රාශි සමතුලිත කිරීම අවශ්‍ය - චිත්තවේගීය සැකසුම් අවශ්‍ය විය හැක",
  };
}

function calculateRashiAdhipathiPorondam(brideLord: string, groomLord: string): PorondamScore {
  const friendship = PLANET_FRIENDSHIP[brideLord]?.[groomLord] ?? "neutral";
  const score = friendship === "friend" ? 5 : friendship === "neutral" ? 3 : 0;
  const matched = score >= 3;
  
  return {
    name: "Rashi Adhipathi Porondam",
    nameSinhala: "රාශි අධිපති පොරොන්දම",
    maxPoints: 5,
    score,
    matched,
    description: matched
      ? "Ruling planets are friendly - supports mutual understanding"
      : "Ruling planets have tension - may affect thought harmony",
    descriptionSinhala: matched
      ? "පාලක ග්‍රහයන් මිත්‍ර වේ - අන්‍යෝන්‍ය අවබෝධයට සහාය වේ"
      : "පාලක ග්‍රහයන්ට ආතතියක් ඇත - සිතුවිලි සමගියට බලපෑ හැක",
  };
}

function calculateVashyaPorondam(rashi1: number, rashi2: number): PorondamScore {
  // Vashya groups
  const vashyaGroups: Record<string, number[]> = {
    Chatushpada: [1, 2, 5, 9, 10], // Quadrupeds
    Manava: [3, 6, 7, 11], // Human
    Jalachara: [4, 12], // Water
    Vanachara: [5], // Forest
    Keeta: [8], // Insect
  };
  
  // Find groups for each rashi
  let group1 = "", group2 = "";
  for (const [group, rashis] of Object.entries(vashyaGroups)) {
    if (rashis.includes(rashi1)) group1 = group;
    if (rashis.includes(rashi2)) group2 = group;
  }
  
  const matched = group1 === group2 || 
    (group1 === "Manava" && group2 === "Chatushpada") ||
    (group1 === "Chatushpada" && group2 === "Manava");
  
  return {
    name: "Vashya Porondam",
    nameSinhala: "වශ්‍ය පොරොන්දම",
    maxPoints: 2,
    score: matched ? 2 : 0,
    matched,
    description: matched
      ? "Mutual attraction and influence is positive"
      : "Attraction aspect is neutral",
    descriptionSinhala: matched
      ? "අන්‍යෝන්‍ය ආකර්ෂණය හා බලපෑම ධනාත්මක වේ"
      : "ආකර්ෂණ අංශය මධ්‍යස්ථ වේ",
  };
}

function calculateRajjuPorondam(brideNak: number, groomNak: number): PorondamScore {
  const brideRajju = NAKSHATRA_RAJJU[brideNak];
  const groomRajju = NAKSHATRA_RAJJU[groomNak];
  const matched = brideRajju !== groomRajju;
  
  return {
    name: "Rajju Porondam",
    nameSinhala: "රජ්ජු පොරොන්දම",
    maxPoints: 1,
    score: matched ? 1 : 0,
    matched,
    description: matched
      ? "Physical bond is favorable - indicates lasting relationship"
      : "Same Rajju - traditional caution advised for this aspect",
    descriptionSinhala: matched
      ? "ශාරීරික බැඳීම හිතකර වේ - කල්පවත්නා සම්බන්ධතාවයක් පෙන්නුම් කරයි"
      : "එකම රජ්ජු - මෙම අංශය සඳහා සාම්ප්‍රදායික අවධානය අවශ්‍ය වේ",
  };
}

function calculateVedhaPorondam(brideNak: number, groomNak: number): PorondamScore {
  const isVedha = VEDHA_PAIRS.some(([a, b]) => 
    (brideNak === a && groomNak === b) || (brideNak === b && groomNak === a)
  );
  const matched = !isVedha;
  
  return {
    name: "Vedha Porondam",
    nameSinhala: "වේධ පොරොන්දම",
    maxPoints: 1,
    score: matched ? 1 : 0,
    matched,
    description: matched
      ? "No obstruction between stars - relationship flows smoothly"
      : "Vedha dosha present - may face obstacles in relationship",
    descriptionSinhala: matched
      ? "තාරකා අතර බාධාවක් නැත - සම්බන්ධතාවය සුමටව ගලා යයි"
      : "වේධ දෝෂය පවතී - සම්බන්ධතාවයේ බාධා ඇති විය හැක",
  };
}

function calculateLingaPorondam(gender1: "male" | "female", gender2: "male" | "female"): PorondamScore {
  const matched = gender1 !== gender2;
  
  return {
    name: "Linga Porondam",
    nameSinhala: "ලිංග පොරොන්දම",
    maxPoints: 1,
    score: matched ? 1 : 0,
    matched,
    description: matched
      ? "Gender compatibility is natural"
      : "Same gender - traditional matching not applicable",
    descriptionSinhala: matched
      ? "ස්ත්‍රී පුරුෂ ගැලපීම ස්වාභාවික වේ"
      : "එකම ස්ත්‍රී පුරුෂ භාවය - සාම්ප්‍රදායික ගැලපීම අදාළ නොවේ",
  };
}

function calculateGotraPorondam(brideNak: number, groomNak: number): PorondamScore {
  // Different nakshatras indicate different gotras (simplified)
  const matched = brideNak !== groomNak;
  
  return {
    name: "Gotra Porondam",
    nameSinhala: "ගෝත්‍ර පොරොන්දම",
    maxPoints: 1,
    score: matched ? 1 : 0,
    matched,
    description: matched
      ? "Different lineages - genetic compatibility favorable"
      : "Same nakshatra - verify family lineage separately",
    descriptionSinhala: matched
      ? "විවිධ පරම්පරා - ජාන ගැලපීම හිතකර වේ"
      : "එකම නැකත - පවුල් පරම්පරාව වෙන වෙනම සත්‍යාපනය කරන්න",
  };
}

function calculateVarnaPorondam(rashi1: number, rashi2: number): PorondamScore {
  // Varna based on rashi
  const varnas = ["Brahmin", "Kshatriya", "Vaishya", "Shudra"];
  const rashiVarna: Record<number, number> = {
    1: 1, 2: 3, 3: 2, 4: 0, 5: 1, 6: 3, 7: 2, 8: 0, 9: 1, 10: 3, 11: 2, 12: 0
  };
  
  const varna1 = rashiVarna[rashi1] ?? 0;
  const varna2 = rashiVarna[rashi2] ?? 0;
  const matched = varna1 <= varna2 || Math.abs(varna1 - varna2) <= 1;
  
  return {
    name: "Varna Porondam",
    nameSinhala: "වර්ණ පොරොන්දම",
    maxPoints: 1,
    score: matched ? 1 : 0,
    matched,
    description: matched
      ? "Social and spiritual compatibility is favorable"
      : "Different spiritual inclinations - mutual respect important",
    descriptionSinhala: matched
      ? "සමාජීය හා ආධ්‍යාත්මික ගැලපීම හිතකර වේ"
      : "විවිධ ආධ්‍යාත්මික නැඹුරුතා - අන්‍යෝන්‍ය ගෞරවය වැදගත් වේ",
  };
}

function calculateVrukshaPorondam(brideNak: number, groomNak: number): PorondamScore {
  // Simplified - different nakshatras have different trees
  const matched = Math.abs(brideNak - groomNak) > 3;
  
  return {
    name: "Vruksha Porondam",
    nameSinhala: "වෘක්ෂ පොරොන්දම",
    maxPoints: 1,
    score: matched ? 1 : 0,
    matched,
    description: matched
      ? "Physical strength compatibility is good for progeny"
      : "Physical vitality aspect is neutral",
    descriptionSinhala: matched
      ? "ශාරීරික ශක්ති ගැලපීම දරු සම්පත සඳහා හොඳයි"
      : "ශාරීරික ශක්ති අංශය මධ්‍යස්ථ වේ",
  };
}

function calculateAyushaPorondam(brideNak: number, groomNak: number): PorondamScore {
  // Life expectancy - male's nakshatra residue should be higher
  const matched = groomNak >= brideNak;
  
  return {
    name: "Ayusha Porondam",
    nameSinhala: "ආයුෂ පොරොන්දම",
    maxPoints: 1,
    score: matched ? 1 : 0,
    matched,
    description: matched
      ? "Life expectancy compatibility is favorable"
      : "Longevity aspect needs attention",
    descriptionSinhala: matched
      ? "ආයු ගැලපීම හිතකර වේ"
      : "දීර්ඝායු අංශයට අවධානය අවශ්‍ය වේ",
  };
}

function calculatePakshiPorondam(brideNak: number, groomNak: number): PorondamScore {
  // Bird classification (simplified)
  const birds = ["Peacock", "Crow", "Owl", "Cock", "Vulture"];
  const nakBird = (nak: number) => birds[(nak - 1) % 5];
  const matched = nakBird(brideNak) === nakBird(groomNak) || 
    Math.abs((brideNak % 5) - (groomNak % 5)) <= 1;
  
  return {
    name: "Pakshi Porondam",
    nameSinhala: "පක්ෂි පොරොන්දම",
    maxPoints: 1,
    score: matched ? 1 : 0,
    matched,
    description: matched
      ? "Lucky bird signs are compatible"
      : "Bird signs are different - minor aspect",
    descriptionSinhala: matched
      ? "වාසනාවන්ත පක්ෂි ලකුණු ගැලපේ"
      : "පක්ෂි ලකුණු වෙනස් - සුළු අංශයකි",
  };
}

function calculatePanchaMahaBhuthaPorondam(brideNadi: string, groomNadi: string): PorondamScore {
  // Five elements based on Nadi
  const matched = brideNadi !== groomNadi;
  
  return {
    name: "Pancha Maha Bhutha Porondam",
    nameSinhala: "පංච මහා භූත පොරොන්දම",
    maxPoints: 1,
    score: matched ? 1 : 0,
    matched,
    description: matched
      ? "Five elements are balanced between partners"
      : "Same elemental constitution - health awareness advised",
    descriptionSinhala: matched
      ? "පංච මහා භූත දෙපාර්ශ්වය අතර සමතුලිත වේ"
      : "එකම මූලද්‍රව්‍ය ස්වභාවය - සෞඛ්‍ය දැනුවත්භාවය අවශ්‍ය වේ",
  };
}

function calculateDinaPorondam(brideNak: number, groomNak: number): PorondamScore {
  // Day compatibility based on nakshatra count
  const count = ((groomNak - brideNak + 27) % 27) + 1;
  const remainder = count % 9;
  const matched = remainder !== 2 && remainder !== 4 && remainder !== 6 && remainder !== 8;
  
  return {
    name: "Dina Porondam",
    nameSinhala: "දින පොරොන්දම",
    maxPoints: 3,
    score: matched ? 3 : 0,
    matched,
    description: matched
      ? "Daily life compatibility is favorable"
      : "Some daily friction possible - patience helps",
    descriptionSinhala: matched
      ? "දෛනික ජීවිත ගැලපීම හිතකර වේ"
      : "යම් දෛනික ගැටුම් ඇති විය හැක - ඉවසීම උපකාරී වේ",
  };
}

function calculateNadiPorondam(brideNadi: string, groomNadi: string): PorondamScore {
  const matched = brideNadi !== groomNadi;
  
  return {
    name: "Nadi Porondam",
    nameSinhala: "නාඩි පොරොන්දම",
    maxPoints: 8,
    score: matched ? 8 : 0,
    matched,
    description: matched
      ? "Health and genetic compatibility is excellent"
      : "Same Nadi (Nadi Dosha) - health precautions advised",
    descriptionSinhala: matched
      ? "සෞඛ්‍ය හා ජාන ගැලපීම විශිෂ්ට වේ"
      : "එකම නාඩි (නාඩි දෝෂය) - සෞඛ්‍ය පූර්වාරක්ෂාව අවශ්‍ය වේ",
  };
}

function calculateGrahaPorondam(brideLord: string, groomLord: string): PorondamScore {
  const friendship = PLANET_FRIENDSHIP[brideLord]?.[groomLord] ?? "neutral";
  const score = friendship === "friend" ? 5 : friendship === "neutral" ? 3 : 1;
  const matched = score >= 3;
  
  return {
    name: "Graha Porondam",
    nameSinhala: "ග්‍රහ පොරොන්දම",
    maxPoints: 5,
    score,
    matched,
    description: matched
      ? "Planetary influences are harmonious"
      : "Planetary influences need balancing",
    descriptionSinhala: matched
      ? "ග්‍රහ බලපෑම් සුසංයෝගී වේ"
      : "ග්‍රහ බලපෑම් සමතුලිත කිරීම අවශ්‍ය වේ",
  };
}

/**
 * Calculate overall compatibility percentage
 */
export function calculateOverallScore(scores: PorondamScores): number {
  const totalScore = Object.values(scores).reduce((sum, s) => sum + s.score, 0);
  const maxScore = Object.values(scores).reduce((sum, s) => sum + s.maxPoints, 0);
  return Math.round((totalScore / maxScore) * 100);
}

/**
 * Generate recommendations based on scores
 */
export function generateRecommendations(scores: PorondamScores, overallScore: number): string {
  const recommendations: string[] = [];
  
  if (overallScore >= 70) {
    recommendations.push("This is an excellent match with strong compatibility across most aspects.");
  } else if (overallScore >= 50) {
    recommendations.push("This is a good match with moderate compatibility. Some areas may need attention.");
  } else {
    recommendations.push("This match shows some challenges. Consider consulting an astrologer for remedies.");
  }
  
  // Specific recommendations based on low scores
  if (!scores.nadi.matched) {
    recommendations.push("Nadi Dosha present - consider performing Nadi Dosha Nivarana puja.");
  }
  if (!scores.gana.matched) {
    recommendations.push("Different temperaments - practice patience and understanding in daily life.");
  }
  if (!scores.yoni.matched) {
    recommendations.push("Physical compatibility needs attention - open communication is key.");
  }
  if (!scores.rajju.matched) {
    recommendations.push("Same Rajju - traditional remedies may be considered.");
  }
  
  return recommendations.join(" ");
}

/**
 * Generate Sinhala recommendations
 */
export function generateRecommendationsSinhala(scores: PorondamScores, overallScore: number): string {
  const recommendations: string[] = [];
  
  if (overallScore >= 70) {
    recommendations.push("මෙය බොහෝ අංශවල ශක්තිමත් ගැලපීමක් සහිත විශිෂ්ට ගැලපීමකි.");
  } else if (overallScore >= 50) {
    recommendations.push("මෙය මධ්‍යස්ථ ගැලපීමක් සහිත හොඳ ගැලපීමකි. සමහර ක්ෂේත්‍රවලට අවධානය අවශ්‍ය විය හැක.");
  } else {
    recommendations.push("මෙම ගැලපීම සමහර අභියෝග පෙන්නුම් කරයි. පිළියම් සඳහා ජ්‍යෝතිෂ්‍යවේදියෙකුගෙන් උපදෙස් ලබා ගැනීම සලකා බලන්න.");
  }
  
  if (!scores.nadi.matched) {
    recommendations.push("නාඩි දෝෂය පවතී - නාඩි දෝෂ නිවාරණ පූජාව සිදු කිරීම සලකා බලන්න.");
  }
  if (!scores.gana.matched) {
    recommendations.push("විවිධ ස්වභාවයන් - දෛනික ජීවිතයේ ඉවසීම හා අවබෝධය පුහුණු කරන්න.");
  }
  if (!scores.yoni.matched) {
    recommendations.push("ශාරීරික ගැලපීමට අවධානය අවශ්‍ය - විවෘත සන්නිවේදනය ප්‍රධාන වේ.");
  }
  
  return recommendations.join(" ");
}
