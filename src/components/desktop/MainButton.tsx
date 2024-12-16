import React from "react";
import "./MainButton.scss";
import { useDataContext } from "context/data.context";

function MainButton({ text, onClick }: { text: string; onClick: () => void }) {
	const { gettingServerStatus, gettingApiKeyStatus } = useDataContext();
	return (
		<button
			className={`main-btn ${
				!gettingServerStatus && !gettingApiKeyStatus ? "" : "loading"
			}`}
			onClick={onClick}
		>
			{text}
		</button>
	);
}

export default React.memo(MainButton);
