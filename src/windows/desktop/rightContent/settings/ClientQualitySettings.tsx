import FormTemplate from "@components/form-template/FormTemplate";
import { useTranslation } from "react-i18next";

function ClientQualitySettings() {
	const { t } = useTranslation();

	return (
		<FormTemplate scroll={false}>
			{/* Form Title */}
			<span className="form-title">{t("client")} - {t("quality")}</span>
		</FormTemplate>
	);
}

export default ClientQualitySettings;
