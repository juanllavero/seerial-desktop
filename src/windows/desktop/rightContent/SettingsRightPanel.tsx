import React, { useState } from "react";
import "./SettingsRightPanel.scss";
import { RootState } from "@redux/store";
import i18n from "i18n";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

function SettingsRightPanel() {
	

	return (
		<div className="settings-panel">
			<span className="settings-title">SettingsPanel</span>
			<span>Test settings</span>
			<span>Test settings</span>
		</div>
	);
}

export default React.memo(SettingsRightPanel);
