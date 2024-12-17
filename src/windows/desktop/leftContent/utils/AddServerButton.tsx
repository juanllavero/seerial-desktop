import { AddIcon } from "@components/utils/IconLibrary";
import React from "react";
import "./AddServerButton.scss";

function AddServerButton() {
	return (
		<button className="add-server-btn" title="Añadir servidor">
			<AddIcon />
			<span>Añadir Servidor</span>
		</button>
	);
}

export default React.memo(AddServerButton);
