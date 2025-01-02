import FormTemplate from "@components/form-template/FormTemplate";
import { useTranslation } from "react-i18next";

function ClientPlayerSettings() {
	const { t } = useTranslation();

	return (
		<FormTemplate scroll={false}>
			{/* Form Title */}
			<span className="form-title">{t("client")} - {t("player")}</span>
		</FormTemplate>
	);
}

export default ClientPlayerSettings;
