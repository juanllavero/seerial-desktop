import { AddIcon } from "@components/utils/IconLibrary";
import { toggleLibraryEditWindow } from "@redux/slices/dataSlice";
import { t } from "i18next";
import React from "react";
import { useDispatch } from "react-redux";

function AddLibraryButton() {
	const dispatch = useDispatch();

	const handleOnClick = () => {
		dispatch(toggleLibraryEditWindow());
	};

	return (
		<button
			className="libraries-button"
			onClick={handleOnClick}
			title={t("libraryWindowTitle")}
		>
			<AddIcon />
			<span className="library-name">{t("libraryWindowTitle")}</span>
		</button>
	);
}

export default React.memo(AddLibraryButton);
