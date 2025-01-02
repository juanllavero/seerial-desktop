import CheckBox from "@components/form-template/CheckBox";
import FormItem from "@components/form-template/FormItem";
import FormTemplate from "@components/form-template/FormTemplate";
import Select from "@components/form-template/Select";
import { useSettingsContext } from "context/settings.context";
import i18n from "i18n";
import { useTranslation } from "react-i18next";

function ClientGeneralSettings() {
	const { t } = useTranslation();
	const {
		language,
		handleLanguageChange,
		playMusic,
		setPlayMusic,
		getLanguageName,
	} = useSettingsContext();

	const supportedLanguages = Array.isArray(i18n.options?.supportedLngs)
		? i18n.options.supportedLngs.filter((lng) => lng !== "cimode")
		: [];

	return (
		<FormTemplate scroll={false}>
			{/* Form Title */}
			<span className="form-title">{t("client")} - {t("generalButton")}</span>

			{/* Form Item */}
			<FormItem label={t("languageText")}>
				<Select value={language} onChange={handleLanguageChange}>
					{supportedLanguages.map((lng: string) => (
						<option key={lng} value={lng}>
							{getLanguageName(lng) || lng}
						</option>
					))}
				</Select>
			</FormItem>

			{/* Form Item */}
			<FormItem>
				<CheckBox
					label={t("playMusicDesktop")}
					checked={playMusic}
					onChange={() => setPlayMusic(!playMusic)}
				/>
			</FormItem>
		</FormTemplate>
	);
}

export default ClientGeneralSettings;
