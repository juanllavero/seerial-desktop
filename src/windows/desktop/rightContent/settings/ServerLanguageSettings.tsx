import FormItem from "@components/desktop/form-template/FormItem";
import FormTemplate from "@components/desktop/form-template/FormTemplate";
import Select from "@components/desktop/form-template/Select";
import MainButton from "@components/desktop/MainButton";
import { useSettingsContext } from "context/settings.context";
import React from "react";
import { useTranslation } from "react-i18next";

function ServerLanguageSettings() {
	const { t } = useTranslation();
	const {
		subsMode,
		preferAudioLang,
		preferSubsLang,
		handleSubsModeChange,
		handlePreferAudioChange,
		handlePreferSubsChange,
		getLanguageName,
	} = useSettingsContext();

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

	return (
		<FormTemplate scroll={false}>
			{/* Form Title */}
			<span className="form-title">{t("server")} - {t("languages")}</span>

			{/* Form Item */}
			<FormItem label={t("preferAudio")}>
				<Select value={preferAudioLang} onChange={handlePreferAudioChange}>
					{languages.map((lang) => (
						<option key={lang.code} value={lang.code}>
							{getLanguageName(lang.code) || lang.name}
						</option>
					))}
				</Select>
			</FormItem>

			{/* Form Item */}
			<FormItem label={t("preferSubs")}>
				<Select value={preferSubsLang} onChange={handlePreferSubsChange}>
					{languages.map((lang) => (
						<option key={lang.code} value={lang.code}>
							{getLanguageName(lang.code) || lang.name}
						</option>
					))}
				</Select>
			</FormItem>

			{/* Form Item */}
			<FormItem label={t("subsMode")}>
				<Select value={subsMode} onChange={handleSubsModeChange}>
					<option value={1}>{t("manualSubs")}</option>
					<option value={2}>{t("autoSubs")}</option>
					<option value={3}>{t("alwaysSubs")}</option>
				</Select>
			</FormItem>

			<div>
				<MainButton text={t("save")} onClick={() => {}} />
			</div>
		</FormTemplate>
	);
}

export default React.memo(ServerLanguageSettings);
