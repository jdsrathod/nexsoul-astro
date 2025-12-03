import { GoogleGenAI, Type } from "@google/genai";
import type { BirthDetails, RashiInsights } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * Converts a sidereal longitude (in degrees) to its corresponding Vedic Rashi name.
 * This is a deterministic mapping handled on the client-side for 100% accuracy.
 * @param longitude The Moon's sidereal longitude in degrees.
 * @returns The name of the Moon Rashi.
 */
const getRashiFromLongitude = (longitude: number): string => {
  const RASHIS = [
    "Aries (Mesha)", "Taurus (Vrishabha)", "Gemini (Mithuna)", "Cancer (Karka)",
    "Leo (Simha)", "Virgo (Kanya)", "Libra (Tula)", "Scorpio (Vrischika)",
    "Sagittarius (Dhanu)", "Capricorn (Makara)", "Aquarius (Kumbha)", "Pisces (Meena)"
  ];
  // Ensure longitude is within 0-360 range
  const normalizedLongitude = (longitude % 360 + 360) % 360;
  const rashiIndex = Math.floor(normalizedLongitude / 30);
  return RASHIS[rashiIndex];
};

/**
 * Performs the astronomical calculation for the Moon's sidereal longitude.
 * This is a 100% deterministic function running on the client, based on simplified
 * but accurate astronomical formulas (e.g., from Jean Meeus' "Astronomical Algorithms").
 * @param utcDate The birth date and time in UTC.
 * @returns The sidereal longitude of the Moon in degrees.
 */
const calculateSiderealLongitude = (utcDate: Date): number => {
    // 1. Calculate Julian Day from UTC date
    const julianDay = (utcDate.getTime() / 86400000) + 2440587.5;

    // 2. Calculate Julian Centuries since the J2000.0 epoch
    const T = (julianDay - 2451545.0) / 36525;

    // 3. Calculate key astronomical arguments (in degrees)
    const L0 = 218.3164477 + 481267.88123421 * T; // Moon's Mean Longitude
    const D = 297.8501921 + 445267.1114034 * T;   // Moon's Mean Elongation
    const M = 357.5291092 + 35999.0502909 * T;    // Sun's Mean Anomaly
    const M_prime = 134.9633964 + 477198.8675055 * T; // Moon's Mean Anomaly
    const F = 93.2720950 + 483202.0175233 * T;    // Moon's Argument of Latitude

    // 4. Convert arguments to radians for use in trigonometric functions
    const d_rad = D * Math.PI / 180;
    const m_rad = M * Math.PI / 180;
    const m_prime_rad = M_prime * Math.PI / 180;
    const f_rad = F * Math.PI / 180;
    
    // 5. Sum the 6 largest periodic terms to correct for perturbations in the Moon's orbit
    let longitudeCorrection = 0;
    longitudeCorrection += 6.288774 * Math.sin(m_prime_rad); // Equation of the Center
    longitudeCorrection += 1.274027 * Math.sin(2 * d_rad - m_prime_rad); // Evection
    longitudeCorrection += 0.658314 * Math.sin(2 * d_rad); // Variation
    longitudeCorrection += 0.213618 * Math.sin(2 * m_prime_rad);
    longitudeCorrection -= 0.185116 * Math.sin(m_rad); // Parallactic Inequality
    longitudeCorrection -= 0.114332 * Math.sin(2 * f_rad);

    const tropicalLongitude = L0 + longitudeCorrection;

    // 6. Calculate Lahiri Ayanamsa for the given date
    const ayanamsa = 23.85449 + 1.397193 * T + 0.000122 * T * T;

    // 7. Calculate final Sidereal Longitude
    const siderealLongitude = tropicalLongitude - ayanamsa;

    return siderealLongitude;
};


/**
 * Calculates Moon Rashi using a hybrid approach:
 * 1. AI is used for the reliable task of converting local time to UTC.
 * 2. Client-side JS performs the 100% deterministic astronomical calculation.
 */
export const calculateMoonRashi = async (details: BirthDetails): Promise<string> => {
  const systemInstruction = `You are an expert global time-keeping and geolocation assistant. Your sole task is to take a local date, time, and place of birth, and accurately determine the equivalent time in Coordinated Universal Time (UTC). You must correctly identify the IANA timezone and account for any historical daylight saving time rules for the given date. Return ONLY a single JSON object with the UTC time in ISO 8601 format.`;
  
  const prompt = `Convert the following local time to UTC:
- Date: ${details.date} (YYYY-MM-DD)
- Time: ${details.time} (24-hour format HH:MM:SS)
- Place: ${details.city}, ${details.state}, ${details.country}`;

  const conversionSchema = {
    type: Type.OBJECT,
    properties: {
      utcDateTime: {
        type: Type.STRING,
        description: "The full birth date and time converted to UTC, in strict ISO 8601 format (e.g., 'YYYY-MM-DDTHH:MM:SSZ')."
      },
    },
    required: ["utcDateTime"],
  };
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Flash is sufficient for this data conversion task
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0,
        responseMimeType: 'application/json',
        responseSchema: conversionSchema,
      }
    });
    
    // Strict null check for response.text
    if (!response.text) {
        throw new Error("API response was empty.");
    }

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    if (typeof parsedData.utcDateTime !== 'string') {
        throw new Error("API returned an invalid UTC date format.");
    }
    
    // Step 1: Get the reliable UTC date from the AI
    const utcDate = new Date(parsedData.utcDateTime);
    if (isNaN(utcDate.getTime())) {
        throw new Error("Failed to parse the UTC date string from the API.");
    }

    // Step 2: Perform the 100% deterministic calculation on the client
    const siderealLongitude = calculateSiderealLongitude(utcDate);
    
    // Step 3: Map the final longitude to its Rashi
    const moonRashi = getRashiFromLongitude(siderealLongitude);
    return moonRashi;

  } catch (error) {
    console.error("Error in the Moon Rashi calculation process:", error);
    if (error instanceof Error && error.message.includes("400")) {
        return "Could not find the location specified. Please be more specific (e.g., City, State, Country).";
    }
    throw new Error("Failed to determine the Moon Rashi. The cosmic energies are unclear.");
  }
};

export const getInsightsForRashi = async (rashi: string): Promise<RashiInsights> => {
    const systemInstruction = `You are a spiritual wellness advisor for the Nexsoul® brand, specializing in Vedic astrology. Your task is to provide personalized, uplifting, and insightful guidance based on a user's Moon Rashi. You must also recommend the specific Nexsoul® Zodiac Bracelet that corresponds to the user's Rashi from the provided list. The tone should be wise, comforting, and empowering. You must respond ONLY with a single JSON object that strictly adheres to the provided schema. Do not add any extra text or explanations.`;

    const braceletData = `
Aries (Mesha) Bracelet: Red Jasper, Bloodstone, Sunstone
Taurus (Vrishabha) Bracelet: Rose Quartz, Green Jade, Green Aventurine
Gemini (Mithun) Bracelet: Lapis Lazuli, Fluorite, Sodalite
Cancer (Karka) Bracelet: Moonstone, Clear Quartz, Rose Quartz
Leo (Simha) Bracelet: Tiger Eye, Citrine, Pyrite
Virgo (Kanya) Bracelet: Green Aventurine, Howlite, Amethyst
Libra (Tula) Bracelet: Rose Quartz, Lapis Lazuli, Green Jade
Scorpio (Vrischika) Bracelet: Black Obsidian, Black Tourmaline, Hematite
Sagittarius (Dhanu) Bracelet: Amethyst, Sodalite, Citrine
Capricorn (Makar) Bracelet: Black Onyx, Hematite, Black Obsidian
Aquarius (Kumbha) Bracelet: Amethyst, Fluorite, Lapis Lazuli
Pisces (Meen) Bracelet: Amethyst, Fluorite, Clear Quartz
`;

    const prompt = `Generate spiritual insights for the Moon Rashi: ${rashi}. This should include a brief summary of their core nature, a list of 3 key strengths, a list of 2 potential challenges to be mindful of, and the specific Nexsoul® Zodiac Bracelet recommendation from the list below.

Available Nexsoul® Zodiac Bracelets:
${braceletData}
`;

    const insightsSchema = {
        type: Type.OBJECT,
        properties: {
            summary: {
                type: Type.STRING,
                description: "A brief, one-paragraph summary of the Rashi's core emotional and personality traits."
            },
            strengths: {
                type: Type.ARRAY,
                description: "A list of exactly 3 key strengths associated with this Rashi.",
                items: { type: Type.STRING }
            },
            challenges: {
                type: Type.ARRAY,
                description: "A list of exactly 2 potential challenges or areas for growth for this Rashi.",
                items: { type: Type.STRING }
            },
            recommendedBracelet: {
                type: Type.OBJECT,
                description: "The recommended Nexsoul Zodiac Bracelet based on the Rashi.",
                properties: {
                    name: { type: Type.STRING, description: "The name of the bracelet, including the Rashi name in parentheses." },
                    crystals: {
                        type: Type.ARRAY,
                        description: "A list of the specific crystals used in the bracelet.",
                        items: { type: Type.STRING }
                    }
                },
                required: ["name", "crystals"]
            }
        },
        required: ["summary", "strengths", "challenges", "recommendedBracelet"],
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction,
                temperature: 0.7,
                responseMimeType: 'application/json',
                responseSchema: insightsSchema,
            }
        });

        // Strict null check for response.text
        if (!response.text) {
             throw new Error("API response was empty.");
        }

        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);
        
        if (!parsedData.summary || !parsedData.strengths || !parsedData.challenges || !parsedData.recommendedBracelet) {
             throw new Error("API returned incomplete insight data.");
        }

        return parsedData;

    } catch (error) {
        console.error("Error fetching insights:", error);
        throw new Error("Failed to channel insights from the cosmos.");
    }
};