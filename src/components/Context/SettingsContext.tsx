import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the settings
interface SettingsContextType {
    rotationMultiplier: number;
    setRotationMultiplier: (value: number) => void;
}

// Create the context with a default value
const SettingsContext = createContext<SettingsContextType | undefined>(
    undefined
);

export const DefaultRotationMultiplier: number = 5;
export const MaxRotationMultiplier: number = 100.0;

// Provider component
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [rotationMultiplier, setRotationMultiplier] = useState<number>(DefaultRotationMultiplier);

    return (
        <SettingsContext.Provider
            value={{
                rotationMultiplier,
                setRotationMultiplier
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

// Custom hook for using the settings
export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
};
