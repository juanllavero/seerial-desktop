import { useDataContext } from "context/data.context";
import React from "react";

function SettingsPanel() {
   const { serverList } = useDataContext();

	return (
		<div className="left-container scroll">
			<span>SettingsPanel</span>

         {serverList.map((server, index) => (
            <div key={index}>
               <span>{server.name}</span>
            </div>
         ))}
		</div>
	);
}

export default React.memo(SettingsPanel);
