import { useContext } from "react";
import { WebContainerContext, WebContainerLoadingContext } from '../context/context'

// Custom hook to use WebContainer
export const useWebContainer = () => {
    const instance = useContext(WebContainerContext);
    const loading = useContext(WebContainerLoadingContext);

    if (loading) {
        return null;
    }

    if (!instance) {
        throw new Error("WebContainer is not initialized");
    }

    return instance;
};