import { useDataContext } from "context/data.context";
import "./StatusRightPanelMessage.scss";
import MainButton from "@components/desktop/MainButton";
import { useState } from "react";

function StatusRightPanelMessageAPI({
	title,
	subtitle,
	containsButton,
	buttonText,
}: {
	title: string;
	subtitle: string;
	containsButton: boolean;
	buttonText: string;
}) {
	const { setApiKey } = useDataContext();
	const [text, setText] = useState<string>("");

	return (
		<div className="server-status-container">
			<span id="title">{title}</span>
			<span id="subtitle">{subtitle}</span>
			<input
				type="text"
				value={text}
				onChange={(e) => setText(e.target.value)}
				placeholder="API Key"
			/>
			{containsButton && (
				<MainButton
					text={buttonText}
					onClick={() => {
						setApiKey(text);
					}}
				/>
			)}
		</div>
	);
}

export default StatusRightPanelMessageAPI;
