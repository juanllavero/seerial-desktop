import React from "react";
import "./SettingsRightPanel.scss";

function SettingsRightPanel() {
	return (
		<div className="settings-panel">
			<span>SettingsPanel</span>
			<span>Test settings</span>
			<span>Test settings</span>
		</div>
	);
}

export default React.memo(SettingsRightPanel);
