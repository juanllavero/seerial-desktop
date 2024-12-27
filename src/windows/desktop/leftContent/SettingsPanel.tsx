import { SettingsSections } from "@data/enums/Sections";
import { useSectionContext } from "context/section.context";
import React from "react";
import SettingsButton from "./utils/SettingsButton";
import { useTranslation } from "react-i18next";

function SettingsPanel() {
	const { t } = useTranslation();
	const { currentSettingsSection, setCurrentSettingsSection } = useSectionContext();

	return (
		<div className="left-container scroll">
			<span className="settings-section-title">{t("client")}</span>
			<SettingsButton
				text={t('generalButton')}
				action={() =>
					setCurrentSettingsSection(SettingsSections.ClientGeneral)
				}
				active={currentSettingsSection === SettingsSections.ClientGeneral}
			/>
			<SettingsButton
				text={t('quality')}
				action={() =>
					setCurrentSettingsSection(SettingsSections.ClientQuality)
				}
				active={currentSettingsSection === SettingsSections.ClientQuality}
			/>
			<SettingsButton
				text={t('player')}
				action={() =>
					setCurrentSettingsSection(SettingsSections.ClientPlayer)
				}
				active={currentSettingsSection === SettingsSections.ClientPlayer}
			/>

			<span className="settings-section-title">{t("server")}</span>
			<SettingsButton
				text={t('generalButton')}
				action={() =>
					setCurrentSettingsSection(SettingsSections.ServerGeneral)
				}
				active={currentSettingsSection === SettingsSections.ServerGeneral}
			/>
			<SettingsButton
				text={t('languages')}
				action={() =>
					setCurrentSettingsSection(SettingsSections.ServerLanguages)
				}
				active={currentSettingsSection === SettingsSections.ServerLanguages}
			/>
			<SettingsButton
				text={t('transcode')}
				action={() =>
					setCurrentSettingsSection(SettingsSections.ServerTranscode)
				}
				active={currentSettingsSection === SettingsSections.ServerTranscode}
			/>
			<SettingsButton
				text={t('libraries')}
				action={() =>
					setCurrentSettingsSection(SettingsSections.ServerLibrary)
				}
				active={currentSettingsSection === SettingsSections.ServerLibrary}
			/>
		</div>
	);
}

export default React.memo(SettingsPanel);
