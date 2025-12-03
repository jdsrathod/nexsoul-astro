
export interface BirthDetails {
    date: string;
    time: string;
    city: string;
    state: string;
    country: string;
}

export interface RashiInsights {
    summary: string;
    strengths: string[];
    challenges: string[];
    recommendedBracelet: {
        name: string;
        crystals: string[];
    };
}