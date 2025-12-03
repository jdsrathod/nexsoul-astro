import React, { useState } from 'react';
import type { BirthDetails } from '../types';

interface InputFormProps {
    onSubmit: (details: BirthDetails) => void;
    isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
    const [date, setDate] = useState('2000-01-01');
    const [time, setTime] = useState('01:00:00');
    const [city, setCity] = useState('Gandhinagar');
    const [state, setState] = useState('Gujarat');
    const [country, setCountry] = useState('India');


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (date && time && city && state && country) {
            onSubmit({ date, time, city, state, country });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
            <div className="space-y-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-yellow-200 text-left">Date of Birth</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="mt-1 block w-full bg-white/10 text-white border-yellow-400/50 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-3 placeholder-gray-400"
                    />
                </div>
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-yellow-200 text-left">Time of Birth</label>
                    <input
                        type="time"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        step="1"
                        className="mt-1 block w-full bg-white/10 text-white border-yellow-400/50 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-3 placeholder-gray-400"
                    />
                </div>
                 <div>
                    <label htmlFor="city" className="block text-sm font-medium text-yellow-200 text-left">City</label>
                    <input
                        type="text"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        placeholder="e.g., Gandhinagar"
                        className="mt-1 block w-full bg-white/10 text-white border-yellow-400/50 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-3 placeholder-gray-400"
                    />
                </div>
                 <div>
                    <label htmlFor="state" className="block text-sm font-medium text-yellow-200 text-left">State/Province</label>
                    <input
                        type="text"
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                        placeholder="e.g., Gujarat"
                        className="mt-1 block w-full bg-white/10 text-white border-yellow-400/50 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-3 placeholder-gray-400"
                    />
                </div>
                 <div>
                    <label htmlFor="country" className="block text-sm font-medium text-yellow-200 text-left">Country</label>
                    <input
                        type="text"
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        placeholder="e.g., India"
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