import {
	MenuIcon,
	SettingsIcon,
	ShowsIcon,
	AddIcon,
	HomeIcon,
} from "@components/utils/IconLibrary";
import {
	closeAllMenus,
	toggleMainMenu,
	toggleSettingsMenu,
} from "@redux/slices/contextMenuSlice";
import {
	resetSelection,
	selectLibrary,
	setLibraryForMenu,
	toggleLibraryEditWindow,
} from "@redux/slices/dataSlice";
import LibrariesList from "./LibrariesList";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { useSectionContext } from "context/section.context";
import MoreSection from "./MoreSection";
import SettingsPanel from "./SettingsPanel";
import { LeftPanelSections, RightPanelSections } from "@data/enums/Sections";
import { LibraryData } from "@interfaces/LibraryData";
import { removeTransparentImage } from "@redux/slices/transparentImageLoadedSlice";
import { useCallback, useState } from "react";

function LeftPanel() {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { currentLeftSection, setCurrentLeftSection, setCurrentRightSection } =
		useSectionContext();
	const mainMenuOpen = useSelector(
		(state: RootState) => state.contextMenu.mainMenu
	);
	const [menuContracted, setMenuContracted] = useState<boolean>(false);

	const handleSelectLibrary = useCallback(
		(library: LibraryData | null) => {
			dispatch(selectLibrary(library));
			dispatch(resetSelection());
			dispatch(removeTransparentImage());

			if (library === null) {
				setCurrentRightSection(RightPanelSections.Home);
			} else if (library.type === "Shows" || library.type === "Movies") {
				setCurrentRightSection(RightPanelSections.Collections);
			} else {
				setCurrentRightSection(RightPanelSections.MusicAlbums);
			}
		},
		[dispatch]
	);

	return (
		<section className="left-panel">
			<div className="top-controls">
				{/* <button
					className="svg-add-library-btn select"
					onClick={() => {
						dispatch(setLibraryForMenu(undefined));
						dispatch(toggleLibraryEditWindow());
					}}
				>
					<AddIcon />
					<span>{t("libraryWindowTitle")}</span>
				</button> */}
				{currentLeftSection === LeftPanelSections.Settings ? (
					<>
						<button
							className="svg-button-desktop-controls"
							onClick={() => {
								if (!mainMenuOpen) dispatch(closeAllMenus());
								dispatch(toggleMainMenu());
							}}
						>
							<MenuIcon />
						</button>
						<button
							className="svg-button-desktop-controls"
							onClick={() => {
								if (!mainMenuOpen) dispatch(closeAllMenus());
								dispatch(toggleMainMenu());
							}}
						>
							<MenuIcon />
						</button>
					</>
				) : (
					<button
						className="svg-button-desktop-controls"
						onClick={() => handleSelectLibrary(null)}
					>
						<HomeIcon />
					</button>
				)}
			</div>
			{currentLeftSection === LeftPanelSections.Settings ? (
				<SettingsPanel />
			) : currentLeftSection === LeftPanelSections.More ? (
				<MoreSection />
			) : (
				<LibrariesList />
			)}
		</section>
	);
}

export default LeftPanel;
