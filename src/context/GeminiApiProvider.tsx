import React, { PropsWithChildren } from 'react'
import { GeminiContext } from './context'
import GeminiAPI from '../utils/GeminiApi';
const GeminiApiProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const gemini = new GeminiAPI(GEMINI_API_KEY)
    return (
        <GeminiContext.Provider value={gemini}>{children}</GeminiContext.Provider>
    )
}

export default GeminiApiProvider