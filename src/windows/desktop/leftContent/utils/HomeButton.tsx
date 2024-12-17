import { HomeIcon } from "@components/utils/IconLibrary";
import { LibraryData } from "@interfaces/LibraryData";
import { RootState } from "@redux/store";
import { t } from "i18next";
import React from "react";
import { useSelector } from "react-redux";

function HomeButton({
	handleSelectLibrary,
}: {
	handleSelectLibrary: (library: LibraryData | null) => void;
}) {
	const selectedLibrary = useSelector(
		(state: RootState) => state.data.selectedLibrary
	);

	return (
		<button
			className={`libraries-button ${
				selectedLibrary === null ? "selected" : ""
			}`}
			title={t("home")}
		>
			<HomeIcon onClick={() => handleSelectLibrary(null)} />
			<span
				className="library-name"
				onClick={() => handleSelectLibrary(null)}
			>
				{t("home")}
			</span>
		</button>
	);
}

export default React.memo(HomeButton);
