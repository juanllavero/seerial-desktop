import { useDataContext } from "context/data.context";
import React from "react";

function SettingsPanel() {
	const { serverIP } = useDataContext();

	return (
		<div className="left-container scroll">
			<span>SettingsPanel</span>

			<span>{serverIP}</span>
		</div>
	);
}

export default React.memo(SettingsPanel);
