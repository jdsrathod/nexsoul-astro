import React, { useState } from 'react';
import InputForm from './components/InputForm';
import RecommendationResult from './components/RecommendationResult';
import CosmicLoader from './components/CosmicLoader';
import type { BirthDetails, RashiInsights } from './types';
import { calculateMoonRashi, getInsightsForRashi } from './services/geminiService';

const App: React.FC = () => {
    const [moonRashi, setMoonRashi] = useState<string | null>(null);
    const [insights, setInsights] = useState<RashiInsights | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loaderMessage, setLoaderMessage] = useState<string>('Consulting the cosmos...');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (details: BirthDetails) => {
        setIsLoading(true);
        setError(null);
        setMoonRashi(null);
        setInsights(null);
        
        try {
            // Stage 1: Calculate Rashi
            setLoaderMessage('Consulting the cosmos...');
            const rashiResult = await calculateMoonRashi(details);
            
            // Check for location error from the first call
             if (rashiResult.startsWith("Could not find")) {
                setError(rashiResult);
                setIsLoading(false);
                return;
            }

            setMoonRashi(rashiResult);

            // Stage 2: Get Insights
            setLoaderMessage('Unveiling your cosmic blueprint...');
            const insightResult = await getInsightsForRashi(rashiResult);
            setInsights(insightResult);

        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setMoonRashi(null);
        setInsights(null);
        setError(null);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            {/* Background Gradient & Noise */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0500] to-black z-0"></div>
            
            {/* Seamless Starfield Background */}
            <div id="stars"></div>
            <div id="stars2"></div>
            <div id="stars3"></div>

            <main className="w-full max-w-4xl mx-auto flex flex-col items-center text-center z-10">
                <header className="mb-10 flex flex-col items-center">
                     <h1 className="text-5xl md:text-6xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200 drop-shadow-md">
                        Nexsoul Astro
                    </h1>
                    <p className="mt-4 text-lg text-yellow-100/80 font-light tracking-wide">
                       Unlock your cosmic blueprint with personalized Vedic guidance.
                    </p>
                </header>

                <div className="w-full flex items-center justify-center min-h-[350px]">
                    {!insights && !isLoading && !error && (
                         <div className="w-full max-w-lg p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl animate-fade-in relative">
                            {/* Subtle glow behind the card */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/10 to-transparent blur-xl opacity-50 -z-10 rounded-2xl"></div>
                            <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
                         </div>
                    )}

                    {isLoading && <CosmicLoader message={loaderMessage} />}
                    
                    {error && (
                        <div className="text-center p-8 bg-red-900/20 border border-red-500/50 rounded-lg animate-fade-in max-w-lg backdrop-blur-sm">
                            <p className="text-xl font-semibold text-red-300">A Cosmic Disturbance Occurred</p>
                            <p className="mt-2 text-red-200">{error}</p>
                            <button 
                                onClick={handleReset}
                                className="mt-6 py-2 px-5 bg-yellow-600 hover:bg-yellow-700 rounded-md font-semibold transition-colors text-black shadow-lg"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                    
                    {moonRashi && insights && (
                       <RecommendationResult rashi={moonRashi} insights={insights} onReset={handleReset} />
                    )}
                </div>

                <footer className="mt-12 text-sm text-yellow-500/40 flex flex-col items-center gap-1">
                    <p>&copy; {new Date().getFullYear()} Nexsoul Astro. For spiritual guidance only.</p>
                    <p className="text-xs opacity-50">v1.8.2</p>
                </footer>
            </main>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.7s ease-out forwards;
                }
                .animate-fade-in-delay-1 { animation-delay: 200ms; }
                .animate-fade-in-delay-2 { animation-delay: 400ms; }
                
                /* 
                   Seamless Starfield Animation 
                   Using square SVG tiles to eliminate the "glitch line" seam.
                */
                @keyframes move-stars {
                    from {background-position:0 0;}
                    to {background-position:-2000px 1000px;}
                }
                
                #stars, #stars2, #stars3 {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: 100%;
                    height: 100%;
                    display: block;
                    background: transparent;
                    z-index: 0;
                }

                /* Layer 1: Small stars (Slow) */
                #stars {
                    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSIjRkZGIiBvcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxNTAigcj0iMSIgZmlsbD0iI0ZGRiIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iMTgwIiBjeT0iNDAigcj0iMSIgZmlsbD0iI0ZGRiIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSIxMDAigcj0iMSIgZmlsbD0iI0ZGRiIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+');
                    animation: move-stars 150s linear infinite;
                    background-size: 200px 200px;
                }

                /* Layer 2: Medium stars (Medium Speed) */
                #stars2 {
                    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxLjUiIGZpbGw9IiNGRkYiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjI1MCIgcj0iMS41IiBmaWxsPSIjRkZGIiBvcGFjaXR5PSIwLjYiLz48Y2lyY2xlIGN4PSIyODAiIGN5PSI4MCIgcj0iMS41IiBmaWxsPSIjRkZGIiBvcGFjaXR5PSIwLjYiLz48L3N2Zz4=');
                    animation: move-stars 100s linear infinite;
                    background-size: 300px 300px;
                }

                /* Layer 3: Large stars (Fast, Closer) */
                #stars3 {
                   background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAigcj0iMiIgZmlsbD0iI0ZGRiIgb3BhY2l0eT0iMC44Ii8+PGNpcmNsZSBjeD0iNDAwIiBjeT0iNDAwIiByPSIyIiBmaWxsPSIjRkZGIiBvcGFjaXR5PSIwLjgiLz48L3N2Zz4=');
                   animation: move-stars 70s linear infinite;
                   background-size: 500px 500px;
                }

                /* Cosmic Loader Animations */
                @keyframes pulse-star {
                    0%, 100% { transform: scale(0.95); opacity: 0.8; }
                    50% { transform: scale(1.05); opacity: 1; }
                }
                .animate-pulse-star {
                    animation: pulse-star 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                @keyframes orbit {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-orbit-1 {
                    animation: orbit 8s linear infinite;
                }
                .animate-orbit-2 {
                    animation: orbit 12s linear infinite reverse;
                }
            `}</style>
        </div>
    );
};

export default App;