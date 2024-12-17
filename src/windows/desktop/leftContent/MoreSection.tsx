import { LibraryData } from "@interfaces/LibraryData";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { ContextMenu } from "primereact/contextmenu";
import LeftSectionChangeButton from "./utils/LeftSectionChangeButton";
import LibraryButton from "./utils/LibraryButton";
import { RightPanelSections } from "@data/enums/Sections";
import { ReactUtils } from "@data/utils/ReactUtils";
import { toggleLibraryMenu } from "@redux/slices/contextMenuSlice";
import {
	toggleLibraryEditWindow,
	selectLibrary,
	resetSelection,
} from "@redux/slices/dataSlice";
import { removeTransparentImage } from "@redux/slices/transparentImageLoadedSlice";
import { RootState } from "@redux/store";
import { useSectionContext } from "context/section.context";
import { useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useDataContext } from "context/data.context";

function MoreSection() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { serverList } = useDataContext();
	const { setCurrentRightSection } = useSectionContext();
	const libraries = useSelector((state: RootState) => state.data.libraries);
	const selectedLibrary = useSelector(
		(state: RootState) => state.data.selectedLibrary
	);
	const previousLibraryId = useRef<string | null>(null);

	const libraryMenuOpen = useSelector(
		(state: RootState) => state.contextMenu.libraryMenu
	);
	const libraryForMenu = useSelector(
		(state: RootState) => state.data.libraryForMenu
	);

	const cm = useRef<ContextMenu | null>(null);

	const menuItems = [
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

	// This useEffect is needed to update the right panel when the selected library changes
	useEffect(() => {
		if (selectedLibrary && selectedLibrary.id !== previousLibraryId.current) {
			handleSelectLibrary(selectedLibrary);
			previousLibraryId.current = selectedLibrary.id;
		}
	}, [selectedLibrary]);

	useEffect(() => {
		if (libraries) ReactUtils.saveLibraries(libraries);
	}, [libraries]);

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
			window.electronAPI.deleteLibrary(libraryForMenu);
		}
	};

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
		<>
			<ConfirmDialog />
			<div className="left-container scroll">
				<LeftSectionChangeButton />
				{libraries.map((library: LibraryData, index: number) => {
					return (
						!library.pinned && (
							<LibraryButton
								library={library}
								index={index}
								dragable={false}
								handleSelectLibrary={handleSelectLibrary}
								cm={cm}
							/>
						)
					);
				})}
				<ContextMenu
					model={menuItems}
					ref={cm}
					className={`dropdown-menu ${
						libraryMenuOpen ? " dropdown-menu-open" : ""
					}`}
				/>
			</div>
		</>
	);
}

export default MoreSection;
