import { WebContainer } from "@webcontainer/api";
import { createContext } from "react";

// Create a context to share the WebContainer instance
export const WebContainerContext = createContext<WebContainer | null>(null);
export const WebContainerLoadingContext = createContext<boolean>(true); // New context for loading state