import React, { useState } from 'react';
import type { BirthDetails } from '../types';

interface InputFormProps {
    onSubmit: (details: BirthDetails) => void;
    isLoading: boolean;
}

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
        // Strict check: Cannot be > 12
        if (cleanVal && parseInt(cleanVal) > 12) return;
        setMonth(cleanVal);
    };

    const handleDayChange = (val: string) => {
        const cleanVal = val.replace(/\D/g, '');
        // Strict check: Cannot be > 31
        if (cleanVal && parseInt(cleanVal) > 31) return;
        setDay(cleanVal);
    };

    const handleHourChange = (val: string) => {
        const cleanVal = val.replace(/\D/g, '');
        // Hour in 12h format cannot be > 12
        if (cleanVal && parseInt(cleanVal) > 12) return;
        setHour(cleanVal);
    };

    const handleMinuteSecondChange = (val: string, setter: (v: string) => void) => {
        const cleanVal = val.replace(/\D/g, '');
        // Minutes/Seconds cannot be > 59
        if (cleanVal && parseInt(cleanVal) > 59) return;
        setter(cleanVal);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (day && month && year && hour && minute && city && state && country) {
            // 1. Construct Date: YYYY-MM-DD
            const paddedDay = day.padStart(2, '0');
            const paddedMonth = month.padStart(2, '0');
            const fullDate = `${year}-${paddedMonth}-${paddedDay}`;
            
            // 2. Construct Time: Convert 12h (HR:MN:SE AM/PM) to 24h (HH:MM:SS) for the API
            let hourInt = parseInt(hour);
            const minInt = parseInt(minute);
            const secInt = second ? parseInt(second) : 0;

            // Conversion logic
            if (ampm === 'PM' && hourInt < 12) hourInt += 12;
            if (ampm === 'AM' && hourInt === 12) hourInt = 0;

            const finalTime = `${hourInt.toString().padStart(2, '0')}:${minInt.toString().padStart(2, '0')}:${secInt.toString().padStart(2, '0')}`;
            
            onSubmit({ date: fullDate, time: finalTime, city, state, country });
        }
    };

    return (
        // autoComplete="new-password" is a hack to prevent Chrome/Edge from autofilling address data from previous sessions
        <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6" autoComplete="new-password">
            <div className="space-y-4">
                {/* Date Input */}
                <div>
                    <label className="block text-sm font-medium text-yellow-200 text-left mb-1">
                        Date of Birth <span className="text-yellow-200/50 text-xs ml-1">(DD / MM / YYYY)</span>
                    </label>
                    <div className="flex space-x-2">
                        <input
                            name="day_input_nexsoul"
                            type="text"
                            inputMode="numeric"
                            placeholder="DD"
                            maxLength={2}
                            value={day}
                            onChange={(e) => handleDayChange(e.target.value)}
                            required
                            autoComplete="off"
                            className="w-1/4 bg-white/10 text-white border-yellow-400/50 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-3 placeholder-gray-400 text-center"
                        />
                        <input
                            name="month_input_nexsoul"
                            type="text"
                            inputMode="numeric"
                            placeholder="MM"
                            maxLength={2}
                            value={month}
                            onChange={(e) => handleMonthChange(e.target.value)}
                            required
                            autoComplete="off"
                            className="w-1/4 bg-white/10 text-white border-yellow-400/50 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-3 placeholder-gray-400 text-center"
                        />
                        <input
                            name="year_input_nexsoul"
                            type="text"
                            inputMode="numeric"
                            placeholder="YYYY"
                            maxLength={4}
                            value={year}
                            onChange={(e) => setYear(e.target.value.replace(/\D/g, ''))}
                            required
                            autoComplete="off"
                            className="w-1/2 bg-white/10 text-white border-yellow-400/50 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-3 placeholder-gray-400 text-center"
                        />
                    </div>
                </div>

                {/* Time Input (Split HR:MN:SE AM/PM) */}
                <div>
                    <label className="block text-sm font-medium text-yellow-200 text-left mb-1">
                        Time of Birth <span className="text-yellow-200/50 text-xs ml-1">(HR : MN : SE)</span>
                    </label>
                    <div className="flex space-x-2">
                        {/* Hour */}
                        <input
                            name="hour_input_nexsoul"
                            type="text"
                            inputMode="numeric"
                            placeholder="HR"
                            maxLength={2}
                            value={hour}
                            onChange={(e) => handleHourChange(e.target.value)}
                            required
                            autoComplete="off"
                            className="w-1/4 bg-white/10 text-white border-yellow-400/50 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-3 placeholder-gray-400 text-center"
                        />
                        <span className="text-yellow-400 self-center text-lg font-bold">:</span>
                        {/* Minute */}
                        <input
                            name="minute_input_nexsoul"
                            type="text"
                            inputMode="numeric"
                            placeholder="MN"
                            maxLength={2}
                            value={minute}
                            onChange={(e) => handleMinuteSecondChange(e.target.value, setMinute)}
                            required
                            autoComplete="off"
                            className="w-1/4 bg-white/10 text-white border-yellow-400/50 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-3 placeholder-gray-400 text-center"
                        />
                        <span className="text-yellow-400 self-center text-lg font-bold">:</span>
                        {/* Second */}
                         <input
                            name="second_input_nexsoul"
                            type="text"
                            inputMode="numeric"
                            placeholder="SE"
                            maxLength={2}
                            value={second}
                            onChange={(e) => handleMinuteSecondChange(e.target.value, setSecond)}
                            autoComplete="off"
                            className="w-1/4 bg-white/10 text-white border-yellow-400/50 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-3 placeholder-gray-400 text-center"
                        />
                        {/* AM/PM Selector */}
                        <select
                            value={ampm}
                            onChange={(e) => setAmPm(e.target.value)}
                            className="w-1/4 bg-white/10 text-white border-yellow-400/50 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-3 text-center appearance-none"
                            style={{ textAlignLast: 'center' }}
                        >
                            <option value="AM" className="bg-neutral-900 text-white">AM</option>
                            <option value="PM" className="bg-neutral-900 text-white">PM</option>
                        </select>
                    </div>
                </div>

                 <div>
                    <label htmlFor="city" className="block text-sm font-medium text-yellow-200 text-left">Place of Birth</label>
                    <input
                        type="text"
                        name="city_input_nexsoul"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        placeholder="e.g., Mumbai (or nearest city)"
                        autoComplete="off"
                        className="mt-1 block w-full bg-white/10 text-white border-yellow-400/50 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-3 placeholder-gray-400"
                    />
                </div>
                 <div>
                    <label htmlFor="state" className="block text-sm font-medium text-yellow-200 text-left">State/Province</label>
                    <input
                        type="text"
                        name="state_input_nexsoul"
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                        placeholder="e.g., Maharashtra"
                        autoComplete="off"
                        className="mt-1 block w-full bg-white/10 text-white border-yellow-400/50 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-3 placeholder-gray-400"
                    />
                </div>
                 <div>
                    <label htmlFor="country" className="block text-sm font-medium text-yellow-200 text-left">Country</label>
                    <input
                        type="text"
                        name="country_input_nexsoul"
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        placeholder="e.g., India"
                        autoComplete="off"
                        className="mt-1 block w-full bg-white/10 text-white border-yellow-400/50 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-3 placeholder-gray-400"
                    />
                </div>
            </div>
            
            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-yellow-400/80 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
                {isLoading ? 'Consulting the Stars...' : 'Find Your Rashi'}
            </button>
        </form>
    );
};

export default InputForm;