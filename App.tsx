
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
            setLoaderMessage('Aligning celestial coordinates...');
            const rashiResult = await calculateMoonRashi(details);
            
            // Check for location error from the first call
             if (rashiResult.startsWith("Could not find")) {
                setError(rashiResult);
                setIsLoading(false);
                return;
            }

            setMoonRashi(rashiResult);

            // Stage 2: Get Insights
            setLoaderMessage('Unveiling your cosmic signature...');
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
        <div className="min-h-screen w-full bg-[#020202] text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans selection:bg-amber-500/30 selection:text-amber-100">
            {/* Background Gradient & Noise */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#000000] z-0 pointer-events-none"></div>
            <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
            
            {/* Seamless Starfield Background */}
            <div id="stars"></div>
            <div id="stars2"></div>
            <div id="stars3"></div>

            <main className="w-full max-w-5xl mx-auto flex flex-col items-center text-center z-10 relative">
                <header className="mb-12 flex flex-col items-center animate-fade-in relative">
                    {/* Decorative Elements around Title */}
                    <div className="absolute -top-12 opacity-30 w-[1px] h-20 bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
                    
                    <div className="mb-6 opacity-90">
                         <span className="text-amber-400 text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold border-y border-amber-500/20 py-2 px-6">
                            Vedic Spiritual Intelligence
                         </span>
                    </div>
                     <h1 className="text-5xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_0_15px_rgba(251,191,36,0.2)] font-serif leading-tight tracking-tight">
                        NEXSOUL<br/>ASTRO
                    </h1>
                    <p className="mt-6 text-base md:text-lg text-amber-100/70 font-light max-w-lg leading-relaxed">
                       Unveil your cosmic blueprint. Discover the healing crystal aligned with your Moon Rashi.
                    </p>
                </header>

                <div className="w-full flex items-center justify-center min-h-[450px]">
                    {!insights && !isLoading && !error && (
                         <div className="w-full max-w-xl p-8 md:p-12 bg-[#080808]/80 backdrop-blur-xl rounded-3xl border border-amber-500/20 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] animate-fade-in relative group transition-all duration-500">
                            {/* Golden Glow Effect on Hover */}
                            <div className="absolute -inset-0.5 bg-gradient-to-b from-amber-500/10 to-transparent rounded-3xl blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                            
                            {/* Inner Border Content */}
                            <div className="relative bg-[#0a0a0a] rounded-2xl p-6 md:p-8 border border-white/5 h-full">
                                <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
                            </div>
                         </div>
                    )}

                    {isLoading && <CosmicLoader message={loaderMessage} />}
                    
                    {error && (
                        <div className="text-center p-10 bg-[#1a0505] border border-red-900/50 rounded-2xl animate-fade-in max-w-md backdrop-blur-md shadow-2xl">
                            <p className="text-2xl font-serif text-red-400 mb-3">Cosmic Interruption</p>
                            <p className="text-red-200/70 font-light leading-relaxed mb-6">{error}</p>
                            <button 
                                onClick={handleReset}
                                className="py-3 px-8 bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-white rounded-lg font-medium transition-all duration-300 border border-red-500/20 shadow-lg"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                    
                    {moonRashi && insights && (
                       <RecommendationResult rashi={moonRashi} insights={insights} onReset={handleReset} />
                    )}
                </div>

                <footer className="mt-16 text-sm text-gray-600 flex flex-col items-center gap-2">
                    <p className="font-light tracking-widest uppercase text-[10px]">&copy; Nexsoul&reg; All Rights Reserved</p>
                    <p className="text-[10px] opacity-40 font-mono">v2.0.1</p>
                </footer>
            </main>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
                    to { opacity: 1; transform: translateY(0); filter: blur(0); }
                }
                .animate-fade-in {
                    animation: fade-in 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
                .animate-fade-in-delay-1 { animation-delay: 200ms; }
                .animate-fade-in-delay-2 { animation-delay: 400ms; }
                
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

                #stars {
                    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSIjRkZGIiBvcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxNTAigcj0iMSIgZmlsbD0iI0ZGRiIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iMTgwIiBjeT0iNDAigcj0iMSIgZmlsbD0iI0ZGRiIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSIxMDAigcj0iMSIgZmlsbD0iI0ZGRiIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+');
                    animation: move-stars 150s linear infinite;
                    background-size: 200px 200px;
                }

                #stars2 {
                    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxLjUiIGZpbGw9IiNGRkYiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjI1MCIgcj0iMS41IiBmaWxsPSIjRkZGIiBvcGFjaXR5PSIwLjYiLz48Y2lyY2xlIGN4PSIyODAiIGN5PSI4MCIgcj0iMS41IiBmaWxsPSIjRkZGIiBvcGFjaXR5PSIwLjYiLz48L3N2Zz4=');
                    animation: move-stars 100s linear infinite;
                    background-size: 300px 300px;
                }

                #stars3 {
                   background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAigcj0iMiIgZmlsbD0iI0ZGRiIgb3BhY2l0eT0iMC44Ii8+PGNpcmNsZSBjeD0iNDAwIiBjeT0iNDAwIiByPSIyIiBmaWxsPSIjRkZGIiBvcGFjaXR5PSIwLjgiLz48L3N2Zz4=');
                   animation: move-stars 70s linear infinite;
                   background-size: 500px 500px;
                }

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
