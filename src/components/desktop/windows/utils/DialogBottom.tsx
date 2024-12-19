import React from "react";
import { useTranslation } from "react-i18next";

function DialogBottom({
	cancelAction,
	acceptAction,
	children,
}: {
	cancelAction: () => void;
	acceptAction?: () => void;
	children?: React.ReactNode;
}) {
	const { t } = useTranslation();
	return (
		<section className="dialog-bottom">
			<button className="desktop-dialog-btn" onClick={cancelAction}>
				{t("cancelButton")}
			</button>
			{children ? (
				children
			) : (
				<button className="btn-app-color" onClick={acceptAction}>
					{t("saveButton")}
				</button>
			)}
		</section>
	);
}

export default DialogBottom;
