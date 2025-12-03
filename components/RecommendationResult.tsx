
import React, { useState } from 'react';
import type { RashiInsights } from '../types';
import { MoonIcon, CosmicInsightIcon, CrystalIcon, ShareIcon, GemIcon } from './icons';

interface RecommendationResultProps {
    rashi: string;
    insights: RashiInsights;
    onReset: () => void;
}

interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, children, className = '' }) => (
    <div className={`bg-white/5 border border-yellow-500/20 rounded-xl p-6 backdrop-blur-sm w-full h-full transition-all duration-300 hover:border-yellow-500/40 hover:scale-[1.02] ${className}`}>
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-lg font-bold text-yellow-300 ml-3">{title}</h3>
        </div>
        {children}
    </div>
);

const CheckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);

const WarnIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);

const RecommendationResult: React.FC<RecommendationResultProps> = ({ rashi, insights, onReset }) => {
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

    const handleShare = () => {
        // Prevent multiple clicks while processing
        if (copyStatus !== 'idle') return;

        const shareText = `My Vedic Rashi is ${rashi}! ✨ My recommended Nexsoul® Zodiac Bracelet is the ${insights.recommendedBracelet.name} with ${insights.recommendedBracelet.crystals.join(', ')}. Find yours at Nexsoul Astro!`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareText)
                .then(() => {
                    setCopyStatus('copied');
                    setTimeout(() => setCopyStatus('idle'), 3000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    setCopyStatus('error');
                    setTimeout(() => setCopyStatus('idle'), 3000);
                });
        } else {
            try {
                const textArea = document.createElement("textarea");
                textArea.value = shareText;
                textArea.style.position = "fixed";
                textArea.style.top = "-9999px";
                textArea.style.left = "-9999px";
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                setCopyStatus('copied');
                setTimeout(() => setCopyStatus('idle'), 3000);
            } catch (err) {
                 console.error('Fallback copy method failed:', err);
                 setCopyStatus('error');
                 setTimeout(() => setCopyStatus('idle'), 3000);
            }
        }
    };

    return (
        <div className="w-full max-w-2xl flex flex-col items-center space-y-6">
            {/* Main Rashi Card */}
            <div className="w-full max-w-md bg-black/50 backdrop-blur-lg rounded-2xl border border-yellow-500/30 shadow-2xl shadow-yellow-900/50 text-white p-8 text-center opacity-0 animate-fade-in">
                <div className="flex flex-col items-center justify-center">
                    <MoonIcon className="w-16 h-16 mb-4 text-yellow-400" />
                    <h2 className="text-xl font-semibold text-yellow-300 mb-2">
                        Your Vedic Rashi is
                    </h2>
                    <p className="text-4xl font-bold text-white font-serif tracking-wide">
                        {rashi}
                    </p>
                </div>
            </div>
            
            {/* Nexsoul Zodiac Bracelet Recommendation */}
            <div className="w-full opacity-0 animate-fade-in animate-fade-in-delay-1">
                <InfoCard icon={<CrystalIcon className="w-7 h-7 text-yellow-400"/>} title="Your Nexsoul® Zodiac Bracelet">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        {/* Left side: Info */}
                        <div className="text-center md:text-left">
                            <h4 className="text-3xl font-serif text-white mb-3">{insights.recommendedBracelet.name}</h4>
                            <p className="text-yellow-200/90">
                                Crafted with crystals fully aligned with your Rashi's ruling planet and energy.
                            </p>
                        </div>
                        {/* Right side: Crystals List */}
                        <div>
                             <h5 className="font-semibold text-yellow-100 mb-3 text-center md:text-left">Key Crystals</h5>
                             <ul className="space-y-3">
                                {insights.recommendedBracelet.crystals.map(crystal => (
                                    <li key={crystal} className="bg-yellow-900/20 p-3 rounded-lg border border-yellow-400/20 shadow-inner">
                                        <span className="text-yellow-200 font-medium">
                                            {crystal}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </InfoCard>
            </div>

            {/* Cosmic Insights */}
            <div className="w-full opacity-0 animate-fade-in animate-fade-in-delay-2">
                <InfoCard icon={<CosmicInsightIcon className="w-7 h-7 text-yellow-400"/>} title="Cosmic Insights">
                    <p className="text-yellow-200/90 text-left mb-6">{insights.summary}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        <div>
                            <h4 className="font-semibold text-yellow-100 mb-2">Key Strengths</h4>
                            <ul className="space-y-2">
                                {insights.strengths.map(strength => (
                                    <li key={strength} className="flex items-start">
                                        <CheckIcon className="w-5 h-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                        <span className="text-yellow-200/80">{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-semibold text-yellow-100 mb-2">Potential Challenges</h4>
                            <ul className="space-y-2">
                                {insights.challenges.map(challenge => (
                                    <li key={challenge} className="flex items-start">
                                        <WarnIcon className="w-5 h-5 text-orange-400 mt-0.5 mr-2 flex-shrink-0" />
                                        <span className="text-yellow-200/80">{challenge}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </InfoCard>
            </div>

            <div className="flex items-center space-x-4 mt-2 opacity-0 animate-fade-in animate-fade-in-delay-2">
                 <button
                    onClick={onReset}
                    className="py-2 px-6 bg-yellow-600/80 hover:bg-yellow-700 text-black rounded-md font-semibold transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                    Calculate Again
                </button>
                <button
                    onClick={handleShare}
                    disabled={copyStatus !== 'idle'}
                    className={`flex items-center justify-center py-2 px-6 rounded-md font-semibold transition-all duration-300 shadow-lg w-40 text-center
                        ${copyStatus === 'copied' ? 'bg-green-500/20 text-green-300 border border-green-500/30 cursor-default' : ''}
                        ${copyStatus === 'error' ? 'bg-red-500/20 text-red-300 border border-red-500/30 cursor-default' : ''}
                        ${copyStatus === 'idle' ? 'bg-transparent border border-yellow-500/50 hover:bg-yellow-500/20 text-yellow-300 transform hover:scale-105' : ''}
                    `}
                    aria-label="Share your results"
                >
                    {copyStatus === 'idle' && (
                        <>
                            <ShareIcon className="w-5 h-5 mr-2" />
                            <span>Share Results</span>
                        </>
                    )}
                    {copyStatus === 'copied' && (
                        <>
                            <CheckIcon className="w-5 h-5 mr-2" />
                            <span>Copied!</span>
                        </>
                    )}
                    {copyStatus === 'error' && (
                        <>
                            <WarnIcon className="w-5 h-5 mr-2" />
                            <span>Failed</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default RecommendationResult;
