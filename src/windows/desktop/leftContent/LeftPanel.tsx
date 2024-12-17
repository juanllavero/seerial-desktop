import {
	MenuIcon,
	SettingsIcon,
	HomeIcon,
} from "@components/utils/IconLibrary";
import {
	resetSelection,
	selectLibrary,
} from "@redux/slices/dataSlice";
import LibrariesList from "./LibrariesList";
import { useDispatch } from "react-redux";
import { useSectionContext } from "context/section.context";
import MoreSection from "./MoreSection";
import SettingsPanel from "./SettingsPanel";
import { LeftPanelSections, RightPanelSections } from "@data/enums/Sections";
import { LibraryData } from "@interfaces/LibraryData";
import { removeTransparentImage } from "@redux/slices/transparentImageLoadedSlice";
import { useCallback, useState } from "react";
import "./LeftPanel.scss";

function LeftPanel() {
	const dispatch = useDispatch();
	const { currentLeftSection, setCurrentLeftSection, setCurrentRightSection } =
		useSectionContext();
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
		<section className={`left-panel ${menuContracted && currentLeftSection !== LeftPanelSections.Settings && 'contracted'}`}>
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
				{currentLeftSection !== LeftPanelSections.Settings ? (
					<>
						<button
							className="svg-button-desktop-controls"
							onClick={() => {
								setMenuContracted(!menuContracted);
							}}
						>
							<MenuIcon />
						</button>
						<button
							className="svg-button-desktop-controls"
							onClick={() => {
								setCurrentLeftSection(LeftPanelSections.Settings);
							}}
						>
							<SettingsIcon />
						</button>
					</>
				) : (
					<button
						className="svg-button-desktop-controls"
						onClick={() => {
							setCurrentLeftSection(LeftPanelSections.Pinned);
							handleSelectLibrary(null);
						}}
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
