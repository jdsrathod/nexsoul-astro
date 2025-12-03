
import React, { useState } from 'react';
import type { BirthDetails } from '../types';

interface InputFormProps {
    onSubmit: (details: BirthDetails) => void;
    isLoading: boolean;
}

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
    "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", 
    "Lakshadweep", "Puducherry", "Other / Outside India"
];

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
    // Date State
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    
    // Time State (Split for 12h format)
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const [second, setSecond] = useState('00'); // Default seconds to 00 if skipped
    const [ampm, setAmPm] = useState('PM'); // Default to PM

    // Location State
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');

    const handleMonthChange = (val: string) => {
        const cleanVal = val.replace(/\D/g, '');
        if (cleanVal && parseInt(cleanVal) > 12) return;
        setMonth(cleanVal);
    };

    const handleDayChange = (val: string) => {
        const cleanVal = val.replace(/\D/g, '');
        if (cleanVal && parseInt(cleanVal) > 31) return;
        setDay(cleanVal);
    };

    const handleHourChange = (val: string) => {
        const cleanVal = val.replace(/\D/g, '');
        if (cleanVal && parseInt(cleanVal) > 12) return;
        setHour(cleanVal);
    };

    const handleMinuteSecondChange = (val: string, setter: (v: string) => void) => {
        const cleanVal = val.replace(/\D/g, '');
        if (cleanVal && parseInt(cleanVal) > 59) return;
        setter(cleanVal);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (day && month && year && hour && minute && city && state && country) {
            const paddedDay = day.padStart(2, '0');
            const paddedMonth = month.padStart(2, '0');
            const fullDate = `${year}-${paddedMonth}-${paddedDay}`;
            
            let hourInt = parseInt(hour);
            const minInt = parseInt(minute);
            const secInt = second ? parseInt(second) : 0;

            if (ampm === 'PM' && hourInt < 12) hourInt += 12;
            if (ampm === 'AM' && hourInt === 12) hourInt = 0;

            const finalTime = `${hourInt.toString().padStart(2, '0')}:${minInt.toString().padStart(2, '0')}:${secInt.toString().padStart(2, '0')}`;
            
            onSubmit({ date: fullDate, time: finalTime, city, state, country });
        }
    };

    // HIGH CONTRAST PREMIUM INPUT STYLES
    // Using very dark grey background (not transparent) for maximum text legibility
    const inputClasses = "w-full bg-[#151515] border border-amber-500/20 rounded-md p-4 text-amber-50 placeholder-neutral-600 focus:ring-1 focus:ring-amber-500/50 focus:border-amber-400 focus:bg-[#1a1a1a] transition-all outline-none text-center font-medium tracking-wide shadow-inner";
    
    // ELEGANT LABELS
    const labelClasses = "block text-[11px] font-bold text-amber-500/90 uppercase tracking-[0.15em] mb-2.5 ml-1 font-sans";

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-8" autoComplete="new-password">
            <div className="space-y-6">
                
                {/* Date Input */}
                <div className="animate-fade-in animate-fade-in-delay-1">
                    <label className={labelClasses}>
                        Date of Birth <span className="text-neutral-500 ml-2 normal-case tracking-normal font-light opacity-70">(DD / MM / YYYY)</span>
                    </label>
                    <div className="flex gap-4">
                        <input name="day_input" type="text" inputMode="numeric" placeholder="DD" maxLength={2} value={day} onChange={(e) => handleDayChange(e.target.value)} required autoComplete="off" className={`${inputClasses} flex-1 text-lg`} />
                        <input name="month_input" type="text" inputMode="numeric" placeholder="MM" maxLength={2} value={month} onChange={(e) => handleMonthChange(e.target.value)} required autoComplete="off" className={`${inputClasses} flex-1 text-lg`} />
                        <input name="year_input" type="text" inputMode="numeric" placeholder="YYYY" maxLength={4} value={year} onChange={(e) => setYear(e.target.value.replace(/\D/g, ''))} required autoComplete="off" className={`${inputClasses} flex-[1.5] text-lg`} />
                    </div>
                </div>

                {/* Time Input */}
                <div className="animate-fade-in animate-fade-in-delay-1">
                    <label className={labelClasses}>
                        Time of Birth <span className="text-neutral-500 ml-2 normal-case tracking-normal font-light opacity-70">(12 Hour Format)</span>
                    </label>
                    <div className="flex gap-3 items-center">
                        <input name="hour_input" type="text" inputMode="numeric" placeholder="HR" maxLength={2} value={hour} onChange={(e) => handleHourChange(e.target.value)} required autoComplete="off" className={`${inputClasses} text-lg`} />
                        <span className="text-amber-500/60 text-xl font-light pb-1">:</span>
                        <input name="minute_input" type="text" inputMode="numeric" placeholder="MN" maxLength={2} value={minute} onChange={(e) => handleMinuteSecondChange(e.target.value, setMinute)} required autoComplete="off" className={`${inputClasses} text-lg`} />
                        <span className="text-amber-500/60 text-xl font-light pb-1">:</span>
                        <input name="second_input" type="text" inputMode="numeric" placeholder="SE" maxLength={2} value={second} onChange={(e) => handleMinuteSecondChange(e.target.value, setSecond)} autoComplete="off" className={`${inputClasses} text-lg`} />
                        <div className="w-2"></div>
                        <select value={ampm} onChange={(e) => setAmPm(e.target.value)} className={`${inputClasses} appearance-none cursor-pointer bg-[#151515] text-amber-400 font-bold border-amber-500/30 hover:border-amber-400`}>
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                    </div>
                </div>

                {/* Location Inputs */}
                <div className="space-y-6 animate-fade-in animate-fade-in-delay-2">
                    <div>
                        <label htmlFor="city" className={labelClasses}>Place of Birth</label>
                        <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="e.g., Village/City, District" autoComplete="off" className={`${inputClasses} text-left px-5 font-normal`} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="state" className={labelClasses}>State</label>
                            <select id="state" value={state} onChange={(e) => setState(e.target.value)} required className={`${inputClasses} text-left px-4 appearance-none cursor-pointer text-gray-300 focus:text-white`}>
                                <option value="" disabled className="text-gray-500">Select</option>
                                {indianStates.map((st) => (
                                    <option key={st} value={st} className="bg-neutral-900 text-white py-2">{st}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="country" className={labelClasses}>Country</label>
                            <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} required placeholder="e.g., India" autoComplete="off" className={`${inputClasses} text-left px-5`} />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* METALLIC GOLD BUTTON */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#b48811] via-[#fbd34d] to-[#b48811] text-black rounded-lg font-serif font-bold text-lg tracking-[0.1em] uppercase transition-all duration-300 shadow-[0_4px_25px_rgba(251,191,36,0.25)] hover:shadow-[0_6px_35px_rgba(251,191,36,0.4)] transform hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-10 relative overflow-hidden group border border-amber-200/50"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 skew-y-12"></div>
                <span className="relative z-10 flex items-center justify-center gap-3">
                    {isLoading ? (
                        <>
                            <span className="w-2.5 h-2.5 bg-black rounded-full animate-ping"></span>
                            Aligning Stars...
                        </>
                    ) : (
                        "Reveal My Rashi"
                    )}
                </span>
            </button>
        </form>
    );
};

export default InputForm;
