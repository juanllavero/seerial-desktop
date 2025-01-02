import "./StatusRightPanelMessage.scss";
import MainButton from "@components/MainButton";

function StatusRightPanelMessage({
	title,
	subtitle,
	containsButton,
	action,
	buttonText,
}: {
	title: string;
	subtitle: string;
	containsButton: boolean;
	action?: () => void;
	buttonText?: string;
}) {
	return (
		<div className="server-status-container">
			<span id="title">{title}</span>
			<span id="subtitle">{subtitle}</span>
			{containsButton && (
				<MainButton
					text={buttonText || ""}
					onClick={() => {
						action?.();
					}}
				/>
			)}
		</div>
	);
}

export default StatusRightPanelMessage;
