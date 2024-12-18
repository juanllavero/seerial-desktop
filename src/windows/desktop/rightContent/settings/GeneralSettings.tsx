import { WindowSections } from "@data/enums/Sections";
import ConfigManager from "@data/utils/Configuration";
import { changeMenuSection } from "@redux/slices/menuSectionsSlice";
import i18n from "i18n";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

function GeneralSettings() {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const [language, setLanguage] = useState<string>(i18n.language);
	const [playMusic, setPlayMusic] = useState<boolean>(false);
	const [highQuality, setHighQuality] = useState<boolean>(false);
	const [interpolation, setInterpolation] = useState<boolean>(false);

	const languages = [
		{ code: "en", name: "Inglés" },
		{ code: "es", name: "Español" },
		{ code: "de", name: "Alemán" },
		{ code: "ar", name: "Árabe" },
		{ code: "it", name: "Italiano" },
		{ code: "fr", name: "Francés" },
		{ code: "zh", name: "Chino" },
		{ code: "ja", name: "Japonés" },
		{ code: "ko", name: "Coreano" },
		{ code: "hi", name: "Hindi" },
	];

	const supportedLanguages = Array.isArray(i18n.options?.supportedLngs)
		? i18n.options.supportedLngs.filter((lng) => lng !== "cimode")
		: [];

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

	// useEffect(() => {
	// 	const loadSettings = async () => {
	// 		const configManager = ConfigManager.getInstance();

	// 		setPlayMusic(
	// 			(await configManager.get("playMusicDesktop", "false")) === "true"
	// 		);
	// 		setHighQuality(
	// 			(await configManager.get("highQuality", "false")) === "true"
	// 		);
	// 		setInterpolation(
	// 			(await configManager.get("interpolation", "false")) === "true"
	// 		);
	// 	};

	// 	if (settingsOpen) {
	// 		loadSettings();
	// 	}
	// }, [settingsOpen]);

	const handleLanguageChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const selectedLanguage = event.target.value;
		setLanguage(selectedLanguage);
		i18n.changeLanguage(selectedLanguage);
	};

	return (
      <div className="settings-section">
         <span className="settings-title">General</span>
         <div className="settings-item">
            <span className="settings-item-title"></span>
         </div>
      </div>
   );
}

export default React.memo(GeneralSettings);
