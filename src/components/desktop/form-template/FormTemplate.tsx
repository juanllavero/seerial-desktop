import React from "react";
import "./FormTemplate.scss";

function FormTemplate({
	scroll,
	children,
}: {
	scroll: boolean;
	children: React.ReactNode;
}) {
	return (
		<div className={`form-template ${scroll ? " scroll" : ""}`}>
			{children}
		</div>
	);
}

export default FormTemplate;
