import {
	MenuIcon,
	SettingsIcon,
	HomeIcon,
} from "@components/utils/IconLibrary";
import {
	resetSelection,
	selectLibrary,
	setLibraries,
	toggleLibraryEditWindow,
} from "@redux/slices/dataSlice";
import LibrariesList from "./LibrariesList";
import { useDispatch, useSelector } from "react-redux";
import { useSectionContext } from "context/section.context";
import SettingsPanel from "./SettingsPanel";
import { LeftPanelSections, RightPanelSections } from "@data/enums/Sections";
import { LibraryData } from "@interfaces/LibraryData";
import { removeTransparentImage } from "@redux/slices/transparentImageLoadedSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import "./LeftPanel.scss";
import { toggleLibraryMenu } from "@redux/slices/contextMenuSlice";
import { t } from "i18next";
import { ContextMenu } from "primereact/contextmenu";
import { RootState } from "@redux/store";
import { confirmDialog } from "primereact/confirmdialog";
import { ReactUtils } from "@data/utils/ReactUtils";
import { useDataContext } from "context/data.context";

function LeftPanel() {
	const dispatch = useDispatch();
	const { serverIP } = useDataContext();
	const { currentLeftSection, setCurrentLeftSection, setCurrentRightSection } =
		useSectionContext();
	const [menuContracted, setMenuContracted] = useState<boolean>(false);

	const libraries = useSelector((state: RootState) => state.data.libraries);
	const libraryMenuOpen = useSelector(
		(state: RootState) => state.contextMenu.libraryMenu
	);
	const libraryForMenu = useSelector(
		(state: RootState) => state.data.libraryForMenu
	);

	useEffect(() => {
		if (libraries) ReactUtils.saveLibraries(libraries);
	}, [libraries]);

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

	const cm = useRef<ContextMenu | null>(null);
	const cm2 = useRef<ContextMenu | null>(null);
	const cm3 = useRef<ContextMenu | null>(null);

	const pinnedLibraryMenuItems = [
		{
			label: t("editButton"),
			command: () => {
				dispatch(toggleLibraryEditWindow());
			},
		},
		{
			label: t("searchFiles"),
			command: () => {
				dispatch(toggleLibraryMenu());
			},
		},
		{
			label: t("updateMetadata"),
			command: () => {
				dispatch(toggleLibraryMenu());
			},
		},
		{
			label: t("removeButton"),
			command: () => {
				showDeleteDialog();
				dispatch(toggleLibraryMenu());
			},
		},
	];

	const libraryMenuItems = [
		{
			label: t("editButton"),
			command: () => {
				dispatch(toggleLibraryEditWindow());
			},
		},
		{
			label: t("searchFiles"),
			command: () => {
				dispatch(toggleLibraryMenu());
			},
		},
		{
			label: t("updateMetadata"),
			command: () => {
				dispatch(toggleLibraryMenu());
			},
		},
		{
			label: t("removeButton"),
			command: () => {
				showDeleteDialog();
				dispatch(toggleLibraryMenu());
			},
		},
	];

	const serverMenuItems = [
		{
			label: t("settings"),
			command: () => {
				dispatch(toggleLibraryEditWindow());
			},
		},
	];

	const showDeleteDialog = () => {
		confirmDialog({
			message: t("removeLibraryMessage"),
			header: `${t("removeLibrary")}: ${libraryForMenu?.name}`,
			icon: "pi pi-info-circle",
			defaultFocus: "reject",
			acceptClassName: "p-button-danger",
			accept,
		});
	};

	const accept = () => {
		if (libraryForMenu) {
			// Delete library in server
			fetch(`https://${serverIP}/libraries/${libraryForMenu.id}`, {
				method: "DELETE",
			});

			// Update libraries in client
			dispatch(
				setLibraries(
					libraries.filter((library) => library.id !== libraryForMenu.id)
				)
			);
		}
	};

	return (
		<section
			className={`left-panel ${
				menuContracted &&
				currentLeftSection !== LeftPanelSections.Settings &&
				"contracted"
			}`}
		>
			<div className="top-controls">
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

			{/* Left Panel Content */}
			{currentLeftSection === LeftPanelSections.Settings ? (
				<SettingsPanel />
			) : (
				<LibrariesList cm={cm} handleSelectLibrary={handleSelectLibrary} />
			)}

			{/* Context Menus */}
			<ContextMenu
				model={pinnedLibraryMenuItems}
				ref={cm}
				className={`dropdown-menu ${
					libraryMenuOpen ? " dropdown-menu-open" : ""
				}`}
			/>
			<ContextMenu
				model={libraryMenuItems}
				ref={cm2}
				className={`dropdown-menu ${
					libraryMenuOpen ? " dropdown-menu-open" : ""
				}`}
			/>
			<ContextMenu
				model={serverMenuItems}
				ref={cm3}
				className={`dropdown-menu ${
					libraryMenuOpen ? " dropdown-menu-open" : ""
				}`}
			/>
		</section>
	);
}

export default LeftPanel;
