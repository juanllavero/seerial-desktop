import FormTemplate from "@components/form-template/FormTemplate";
import MainButton from "@components/MainButton";
import { useTranslation } from "react-i18next";

function ServerLibrariesSettings() {
	const { t } = useTranslation();

	return (
		<FormTemplate scroll={false}>
			{/* Form Title */}
			<span className="form-title">
				{t("server")} - {t("libraries")}
			</span>

			<div>
				<MainButton text={t("save")} onClick={() => {}} />
			</div>
		</FormTemplate>
	);
}

export default ServerLibrariesSettings;
