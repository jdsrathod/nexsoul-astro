
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
        <div className="min-h-screen w-full bg-gradient-to-br from-black via-neutral-900 to-black text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            {/* Starfield Background */}
            <div id="stars"></div>
            <div id="stars2"></div>
            <div id="stars3"></div>

            <main className="w-full max-w-4xl mx-auto flex flex-col items-center text-center z-10">
                <header className="mb-10 flex flex-col items-center">
                     <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                        Nexsoul Astro
                    </h1>
                    <p className="mt-4 text-lg text-yellow-200/80">
                       Unlock your cosmic blueprint with personalized Vedic guidance.
                    </p>
                </header>

                <div className="w-full flex items-center justify-center min-h-[350px]">
                    {!insights && !isLoading && !error && (
                         <div className="w-full max-w-lg p-8 bg-black/20 backdrop-blur-md rounded-2xl border border-yellow-500/20 shadow-lg animate-fade-in">
                            <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
                         </div>
                    )}

                    {isLoading && <CosmicLoader message={loaderMessage} />}
                    
                    {error && (
                        <div className="text-center p-8 bg-red-900/30 border border-red-500 rounded-lg animate-fade-in max-w-lg">
                            <p className="text-xl font-semibold text-red-300">A Cosmic Disturbance Occurred</p>
                            <p className="mt-2 text-red-200">{error}</p>
                            <button 
                                onClick={handleReset}
                                className="mt-6 py-2 px-5 bg-yellow-600 hover:bg-yellow-700 rounded-md font-semibold transition-colors text-black"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                    
                    {moonRashi && insights && (
                       <RecommendationResult rashi={moonRashi} insights={insights} onReset={handleReset} />
                    )}
                </div>

                <footer className="mt-12 text-sm text-yellow-400/50 flex flex-col items-center gap-1">
                    <p>&copy; {new Date().getFullYear()} Nexsoul Astro. For spiritual guidance only.</p>
                    <p className="text-xs opacity-50">v1.8.1</p>
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
                
                /* Starfield background */
                @keyframes move-twink-back {
                    from {background-position:0 0;}
                    to {background-position:-10000px 5000px;}
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
                #stars {
                    background-image: url('data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjEwcHgiIGhlaWdodD0iMTAwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMDAgMTAwIiB4bWw6c3BhY2U9InByZXNlcnZlIj48Y2lyY2xlIGZpbGw9IiNGRkYiIGN4PSIyIiBjeT0iMiIgcj0iMC41Ii8+PGNpcmNsZSBmaWxsPSIjRkZGIiBjeD0iOTAiIGN5PSI1IiByPSIwLjUiLz48L3N2Zz4=');
                    animation: move-twink-back 200s linear infinite;
                }
                #stars2 {
                    background-image: url('data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjEwMHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGNpcmNsZSBmaWxsPSIjRkZGIiBjeD0iMjAiIGN5PSI1MCIgcj0iMC44Ii8+PGNpcmNsZSBmaWxsPSIjRkZGIiBjeD0iODAiIGN5PSI5MCIgcj0iMC44Ii8+PC9zdmc+');
                    animation: move-twink-back 150s linear infinite;
                }
                #stars3 {
                   background-image: url('data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjEwMHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGNpcmNsZSBmaWxsPSIjRkZGIiBjeD0iNDAiIGN5PSIzMCIgcj0iMS4yIi8+PGNpcmNsZSBmaWxsPSIjRkZGIiBjeD0iNjAiIGN5PSI3NSIgcj0iMS4yIi8+PC9zdmc+');
                   animation: move-twink-back 100s linear infinite;
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
