import { useContext } from "react";
import { GeminiContext } from "../context/context";

// Custom hook to use WebContainer
export const useGeminiApi = () => {
    const gemini = useContext(GeminiContext);
    if (!gemini) throw new Error("WebContainer is not initialized");;
    return gemini;
};