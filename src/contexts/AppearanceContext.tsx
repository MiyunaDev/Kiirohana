import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AppearanceSettings {
  activeTheme: string;
  globalThemeMode: "Light" | "Dark" | "AMOLED";
  layoutMode: "Compact" | "Comfortable";
  sidebarWidth: number;
  blurEffects: boolean;
  transparency: boolean;
  animation: boolean;
  fontFamily: string;
  fontSize: number;
  dynamicColor: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
}

const defaultAppearanceSettings: AppearanceSettings = {
  activeTheme: "dark-purple",
  globalThemeMode: "Dark",
  layoutMode: "Comfortable",
  sidebarWidth: 260,
  blurEffects: true,
  transparency: true,
  animation: true,
  fontFamily: "inter",
  fontSize: 15,
  dynamicColor: true,
  highContrast: false,
  reducedMotion: false,
};

export interface AppearanceContextType {
  settings: AppearanceSettings;
  updateSetting: <T extends keyof AppearanceSettings>(key: T, value: AppearanceSettings[T]) => void;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export const useAppearanceSettings = () => {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error("useAppearanceSettings must be used within an AppearanceProvider");
  }
  return context;
};

interface AppearanceProviderProps {
  children: ReactNode;
}

export const AppearanceProvider = ({ children }: AppearanceProviderProps) => {
  const [settings, setSettings] = useState<AppearanceSettings>(() => {
    try {
      const storedSettings = localStorage.getItem("kiirohanaAppearanceSettings");
      if (storedSettings) {
        return { ...defaultAppearanceSettings, ...JSON.parse(storedSettings) };
      }
    } catch (error) {
      console.error("Failed to parse stored settings from localStorage", error);
    }
    return defaultAppearanceSettings;
  });

  useEffect(() => {
    try {
      localStorage.setItem("kiirohanaAppearanceSettings", JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
    }
  }, [settings]);

  const updateSetting = <T extends keyof AppearanceSettings>(key: T, value: AppearanceSettings[T]) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  return (
    <AppearanceContext.Provider value={{ settings, updateSetting }}>
      {children}
    </AppearanceContext.Provider>
  );
};
