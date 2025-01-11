import React, { useState, useEffect, PropsWithChildren } from "react";
import { WebContainer } from "@webcontainer/api";
import { WebContainerContext, WebContainerLoadingContext } from "./context";



let webContainerInstance: WebContainer | null = null;

export const WebContainerProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [instance, setInstance] = useState<WebContainer | null>(null);
    const [loading, setLoading] = useState(true); // Track loading state

    // Initialize WebContainer once and ensure it's shared across the app
    useEffect(() => {
        const initializeWebContainer = async () => {
            if (webContainerInstance) {
                setInstance(webContainerInstance);
                setLoading(false);
                console.log("WebContainer already booted");
                return;
            }

            try {
                // Boot WebContainer only once
                const newInstance = await WebContainer.boot();
                webContainerInstance = newInstance; // Save to global reference
                setInstance(newInstance); // Store it in state
                setLoading(false); // Set loading to false once it's booted

                console.log("WebContainer booted successfully");
            } catch (error) {
                console.error("Failed to boot WebContainer:", error);
                setLoading(false);
            }
        };

        initializeWebContainer();

        // Cleanup: reset the global instance reference when unmounted
        return () => {
            webContainerInstance = null;
        };
    }, []);

    return (
        <WebContainerContext.Provider value={instance}>
            <WebContainerLoadingContext.Provider value={loading}>
                {children}
            </WebContainerLoadingContext.Provider>
        </WebContainerContext.Provider>
    );
};


