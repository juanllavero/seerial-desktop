import ConfigManager from "@data/utils/Configuration";
import i18n from "i18n";
import React, { useContext, useEffect, useState } from "react";

interface SettingsContextProps {
	clientLanguage: string;
	setClientLanguage: React.Dispatch<React.SetStateAction<string>>;
	playMusic: boolean;
	setPlayMusic: React.Dispatch<React.SetStateAction<boolean>>;
   autoScan: boolean;
   setAutoScan: React.Dispatch<React.SetStateAction<boolean>>;
   highQuality: boolean;
   setHighQuality: React.Dispatch<React.SetStateAction<boolean>>;
   interpolation: boolean;
   setInterpolation: React.Dispatch<React.SetStateAction<boolean>>;
   showClock: boolean;
   setShowClock: React.Dispatch<React.SetStateAction<boolean>>;
   language: string;
   setLanguage: React.Dispatch<React.SetStateAction<string>>;
   preferAudioLang: string;
   setPreferAudioLang: React.Dispatch<React.SetStateAction<string>>;
   preferSubsLang: string;
   setPreferSubsLang: React.Dispatch<React.SetStateAction<string>>;
   subsMode: string;
   setSubsMode: React.Dispatch<React.SetStateAction<string>>;
   volume: number;
   setVolume: React.Dispatch<React.SetStateAction<number>>;
   videoDelay: number;
   setVideoDelay: React.Dispatch<React.SetStateAction<number>>;
   getLanguageName: (lang: string) => string | undefined;
   handleLanguageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
   handleSubsModeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
   handlePreferSubsChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
   handlePreferAudioChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SettingsContext = React.createContext<
	SettingsContextProps | undefined
>(undefined);

export const SettingsProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [clientLanguage, setClientLanguage] = useState<string>(i18n.language);
	const [playMusic, setPlayMusic] = useState<boolean>(false);
	const [autoScan, setAutoScan] = useState<boolean>(false);
	const [highQuality, setHighQuality] = useState<boolean>(false);
	const [interpolation, setInterpolation] = useState<boolean>(false);
	const [showClock, setShowClock] = useState<boolean>(false);
	const [language, setLanguage] = useState<string>(i18n.language);
	const [preferAudioLang, setPreferAudioLang] = useState<string>(
		i18n.language
	);
	const [subsMode, setSubsMode] = useState<string>(i18n.language);
	const [preferSubsLang, setPreferSubsLang] = useState<string>(i18n.language);

	const [volume, setVolume] = useState<number>(30);
	const [videoDelay, setVideoDelay] = useState<number>(2);

   useEffect(() => {
      const loadSettings = async () => {
			const configManager = ConfigManager.getInstance();

			setPlayMusic(
				(await configManager.get("playMusicDesktop", "false")) === "true"
			);
			setAutoScan((await configManager.get("autoScan", "false")) === "true");
			setHighQuality(
				(await configManager.get("highQuality", "false")) === "true"
			);
			setInterpolation(
				(await configManager.get("interpolation", "false")) === "true"
			);
			setShowClock(
				(await configManager.get("showClock", "true")) === "true"
			);

			setVolume(Number(await configManager.get("backgroundVolume", "30")));
			setVideoDelay(
				Number(await configManager.get("backgroundDelay", "2.0"))
			);
		};

		loadSettings();
   }, []);

   const getLanguageName = (lang: string) => {
		try {
			let langCode = lang.split("-")[0];
			if (!langCode) {
				langCode = lang;
			}

			const languageNames = new Intl.DisplayNames([langCode], {
				type: "language",
				languageDisplay: "standard",
			});
			const languageName = languageNames.of(lang);

			if (languageName)
				return languageName.charAt(0).toUpperCase() + languageName.slice(1);
		} catch (error) {
			console.error("Error retrieving language and country name:", error);
			return lang;
		}
	};

   const handleLanguageChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const selectedLanguage = event.target.value;
		setLanguage(selectedLanguage);
		i18n.changeLanguage(selectedLanguage);
	};

	const handlePreferAudioChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const selectedLanguage = event.target.value;
		setPreferAudioLang(selectedLanguage);
	};

	const handleSubsModeChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const subsModeVal = event.target.value;
		setSubsMode(subsModeVal);
	};

	const handlePreferSubsChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const selectedLanguage = event.target.value;
		setPreferSubsLang(selectedLanguage);
	};

	return (
		<SettingsContext.Provider
			value={{
				clientLanguage,
				setClientLanguage,
				playMusic,
				setPlayMusic,
            autoScan,
            setAutoScan,
            highQuality,
            setHighQuality,
            interpolation,
            setInterpolation,
            showClock,
            setShowClock,
            language,
            setLanguage,
            preferAudioLang,            
            setPreferAudioLang,
            preferSubsLang,
            setPreferSubsLang,
            subsMode,
            setSubsMode,
            volume,            
            setVolume,
            videoDelay,
            setVideoDelay,
            getLanguageName,
            handleLanguageChange,
            handlePreferAudioChange,
            handleSubsModeChange,
            handlePreferSubsChange
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};

// Custom hook to use the DataContext
export const useSettingsContext = (): SettingsContextProps => {
	const context = useContext(SettingsContext);
	if (context === undefined) {
		throw new Error("useDataContext must be used within a SettingsProvider");
	}
	return context;
};
