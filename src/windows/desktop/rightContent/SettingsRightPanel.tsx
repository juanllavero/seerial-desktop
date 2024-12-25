import React from "react";
import "./SettingsRightPanel.scss";
import { useSectionContext } from "context/section.context";
import { SettingsSections } from "@data/enums/Sections";
import ServerGeneralSettings from "./settings/ServerGeneralSettings";
import ServerLanguageSettings from "./settings/ServerLanguageSettings";
import ClientGeneralSettings from "./settings/ClientGeneralSettings";
import ClientPlayerSettings from "./settings/ClientPlayerSettings";
import ClientQualitySettings from "./settings/ClientQualitySettings";
import ServerTranscodeSettings from "./settings/ServerTranscodeSettings";
import ServerLibrariesSettings from "./settings/ServerLibrariesSettings";

function SettingsRightPanel() {
	const { currentSettingsSection } = useSectionContext();

	return (
		<div className="settings-panel">
			{currentSettingsSection === SettingsSections.ClientGeneral ? (
				<ClientGeneralSettings />
			) : currentSettingsSection == SettingsSections.ClientQuality ? (
				<ClientQualitySettings />
			) : currentSettingsSection == SettingsSections.ClientPlayer ? (
				<ClientPlayerSettings />
			) : currentSettingsSection == SettingsSections.ServerGeneral ? (
				<ServerGeneralSettings />
			) : currentSettingsSection == SettingsSections.ServerLanguages ? (
				<ServerLanguageSettings />
			) : currentSettingsSection == SettingsSections.ServerTranscode ? (
				<ServerTranscodeSettings />
			) : (
				<ServerLibrariesSettings />
			)}
		</div>
	);
}

export default React.memo(SettingsRightPanel);
