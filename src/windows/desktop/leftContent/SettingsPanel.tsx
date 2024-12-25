import { SettingsSections } from "@data/enums/Sections";
import { useSectionContext } from "context/section.context";
import React from "react";
import SettingsButton from "./utils/SettingsButton";
import { useTranslation } from "react-i18next";

function SettingsPanel() {
	const { t } = useTranslation();
	const { setCurrentSettingsSection } = useSectionContext();

	return (
		<div className="left-container scroll">
			<span className="settings-section-title">{t("client")}</span>
			<SettingsButton
				text={t('generalButton')}
				action={() =>
					setCurrentSettingsSection(SettingsSections.ClientGeneral)
				}
			/>
			<SettingsButton
				text={t('quality')}
				action={() =>
					setCurrentSettingsSection(SettingsSections.ClientQuality)
				}
			/>
			<SettingsButton
				text={t('player')}
				action={() =>
					setCurrentSettingsSection(SettingsSections.ClientPlayer)
				}
			/>

			<span className="settings-section-title">{t("server")}</span>
			<SettingsButton
				text={t('generalButton')}
				action={() =>
					setCurrentSettingsSection(SettingsSections.ServerGeneral)
				}
			/>
			<SettingsButton
				text={t('languages')}
				action={() =>
					setCurrentSettingsSection(SettingsSections.ServerLanguages)
				}
			/>
			<SettingsButton
				text={t('transcode')}
				action={() =>
					setCurrentSettingsSection(SettingsSections.ServerTranscode)
				}
			/>
			<SettingsButton
				text={t('libraries')}
				action={() =>
					setCurrentSettingsSection(SettingsSections.ServerLibrary)
				}
			/>
		</div>
	);
}

export default React.memo(SettingsPanel);
