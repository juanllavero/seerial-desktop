import FormItem from "@components/form-template/FormItem";
import FormTemplate from "@components/form-template/FormTemplate";
import Input from "@components/form-template/Input";
import MainButton from "@components/MainButton";
import { useDataContext } from "context/data.context";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function ServerGeneralSettings() {
	const { t } = useTranslation();
	const { serverIP, setServerIP } = useDataContext();
	const [ip, setIp] = useState<string>(serverIP);

	const handleSave = () => {
		setServerIP(ip);
	};

	return (
		<FormTemplate scroll={false}>
			{/* Form Title */}
			<span className="form-title">{t("server")} - {t("generalButton")}</span>

			{/* Form Item */}
			<FormItem bottomText={t("serverIPText")}>
				<Input
					label={t("serverIP")}
					value={ip}
					placeholder="192.168.1.10:3000"
					onChange={(e) => setIp(e.target.value)}
				/>
			</FormItem>

			<div>
				<MainButton text={t("save")} onClick={handleSave} />
			</div>
		</FormTemplate>
	);
}

export default React.memo(ServerGeneralSettings);
