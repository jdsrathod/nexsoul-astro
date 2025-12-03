
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
    <div className={`bg-[#080808] border border-amber-500/20 rounded-xl p-8 shadow-xl w-full h-full transition-all duration-300 hover:border-amber-500/40 relative overflow-hidden ${className}`}>
        {/* Subtle accent line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
        
        <div className="flex items-center mb-6 border-b border-white/5 pb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-amber-100 ml-4 font-serif tracking-wide">{title}</h3>
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
        <div className="w-full max-w-3xl flex flex-col items-center space-y-8">
            {/* Main Rashi Card */}
            <div className="w-full max-w-xl bg-gradient-to-br from-[#1a1a1a] to-black rounded-3xl border border-amber-500/40 shadow-2xl shadow-amber-900/20 text-white p-10 text-center opacity-0 animate-fade-in relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 border border-amber-500/20 shadow-[0_0_30px_rgba(251,191,36,0.1)]">
                         <MoonIcon className="w-10 h-10 text-amber-400" />
                    </div>
                    <h2 className="text-sm font-bold text-amber-500 uppercase tracking-[0.2em] mb-3">
                        Your Vedic Moon Sign
                    </h2>
                    <p className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-200 to-amber-500 font-serif pb-2">
                        {rashi}
                    </p>
                </div>
            </div>
            
            {/* Nexsoul Zodiac Bracelet Recommendation */}
            <div className="w-full opacity-0 animate-fade-in animate-fade-in-delay-1">
                <InfoCard icon={<GemIcon className="w-6 h-6 text-amber-400"/>} title="Your Nexsoul® Zodiac Bracelet">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        {/* Left side: Info */}
                        <div className="text-center md:text-left">
                            <h4 className="text-3xl font-serif text-white mb-4 leading-tight">{insights.recommendedBracelet.name}</h4>
                            <p className="text-neutral-400 leading-relaxed text-sm">
                                Crafted with specific crystals that resonate with the frequency of {rashi}, amplifying your natural strengths.
                            </p>
                        </div>
                        {/* Right side: Crystals List */}
                        <div>
                             <h5 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-4 text-center md:text-left">Included Crystals</h5>
                             <ul className="space-y-3">
                                {insights.recommendedBracelet.crystals.map(crystal => (
                                    <li key={crystal} className="bg-[#151515] p-3 px-4 rounded-lg border border-white/5 flex items-center">
                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3"></div>
                                        <span className="text-neutral-200 font-medium">
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
                <InfoCard icon={<CosmicInsightIcon className="w-6 h-6 text-amber-400"/>} title="Cosmic Guidance">
                    <p className="text-neutral-300 text-left mb-8 leading-relaxed text-lg border-l-2 border-amber-500/30 pl-4">
                        "{insights.summary}"
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="bg-[#111] p-5 rounded-xl border border-white/5">
                            <h4 className="font-bold text-white mb-4 flex items-center">
                                <span className="text-green-500 mr-2">✦</span> Key Strengths
                            </h4>
                            <ul className="space-y-3">
                                {insights.strengths.map(strength => (
                                    <li key={strength} className="flex items-start">
                                        <CheckIcon className="w-5 h-5 text-green-500/70 mt-0.5 mr-2 flex-shrink-0" />
                                        <span className="text-neutral-400 text-sm">{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                         <div className="bg-[#111] p-5 rounded-xl border border-white/5">
                            <h4 className="font-bold text-white mb-4 flex items-center">
                                <span className="text-orange-500 mr-2">✦</span> Challenges
                            </h4>
                            <ul className="space-y-3">
                                {insights.challenges.map(challenge => (
                                    <li key={challenge} className="flex items-start">
                                        <WarnIcon className="w-5 h-5 text-orange-500/70 mt-0.5 mr-2 flex-shrink-0" />
                                        <span className="text-neutral-400 text-sm">{challenge}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </InfoCard>
            </div>

            <div className="flex items-center space-x-6 mt-6 opacity-0 animate-fade-in animate-fade-in-delay-2 pb-10">
                 <button
                    onClick={onReset}
                    className="py-3 px-8 border border-neutral-700 hover:border-amber-500/50 text-neutral-400 hover:text-white rounded-lg font-medium transition-all duration-300 uppercase tracking-wider text-xs"
                >
                    Calculate Again
                </button>
                <button
                    onClick={handleShare}
                    disabled={copyStatus !== 'idle'}
                    className={`flex items-center justify-center py-3 px-8 rounded-lg font-bold transition-all duration-300 shadow-xl min-w-[180px] text-sm tracking-wide
                        ${copyStatus === 'copied' ? 'bg-green-900/30 text-green-400 border border-green-500/50' : ''}
                        ${copyStatus === 'error' ? 'bg-red-900/30 text-red-400 border border-red-500/50' : ''}
                        ${copyStatus === 'idle' ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20' : ''}
                    `}
                >
                    {copyStatus === 'idle' && (
                        <>
                            <ShareIcon className="w-4 h-4 mr-2" />
                            <span>SHARE RESULT</span>
                        </>
                    )}
                    {copyStatus === 'copied' && (
                        <>
                            <CheckIcon className="w-4 h-4 mr-2" />
                            <span>COPIED</span>
                        </>
                    )}
                    {copyStatus === 'error' && (
                        <span>FAILED</span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default RecommendationResult;
