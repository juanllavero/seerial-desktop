import { useDispatch, useSelector } from "react-redux";
import {
	selectLibrary,
	toggleLibraryEditWindow,
	resetSelection,
	setLibraries,
} from "../../../redux/slices/dataSlice";
import { removeTransparentImage } from "../../../redux/slices/transparentImageLoadedSlice";
import { RootState } from "../../../redux/store";
import {
	toggleLibraryMenu,
} from "redux/slices/contextMenuSlice";
import { useCallback, useEffect, useRef } from "react";
import { ContextMenu } from "primereact/contextmenu";
import { useTranslation } from "react-i18next";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { LibraryData } from "@interfaces/LibraryData";
import { RightPanelSections } from "@data/enums/Sections";
import { useSectionContext } from "context/section.context";
import "./LibrariesList.scss";
import { ReactUtils } from "@data/utils/ReactUtils";
import LibraryButton from "./utils/LibraryButton";
import HomeButton from "./utils/HomeButton";
import LeftSectionChangeButton from "./utils/LeftSectionChangeButton";

/**
 * A component that displays a list of libraries and allows the user to select a library,
 * open the library menu, edit the library, update the library, and remove the library.
 *
 * @returns A JSX element that displays the list of libraries.
 */
function LibrariesList() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
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

	//#region DRAG AND DROP
	const draggingIndexRef = useRef<number | null>(null); // Index of the dragged item

	const handleDragStart = (index: number) => {
		draggingIndexRef.current = index; // Save the index of the dragged item
		const dragItem = document.querySelectorAll(".libraries-button")[index];
		dragItem?.classList.add("dragging");
	};

	const handleDragEnd = () => {
		const dragItem = document.querySelector(".dragging");
		dragItem?.classList.remove("dragging");
		draggingIndexRef.current = null; // Reset the dragged index
	};

	const handleDragOver = (index: number, e: React.DragEvent) => {
		e.preventDefault();
		const draggingIndex = draggingIndexRef.current;

		// Avoid unnecessary operations if the index hasn't changed
		if (draggingIndex === null || draggingIndex === index) return;

		// Update the order of libraries locally
		const updatedLibraries = [...libraries];
		const [removedItem] = updatedLibraries.splice(draggingIndex, 1);
		updatedLibraries.splice(index, 0, removedItem);

		// Update the index reference
		draggingIndexRef.current = index;

		// Update Redux
		dispatch(setLibraries(updatedLibraries));
	};
	//#endregion

	return (
		<>
			<ConfirmDialog />
			<div className="left-container scroll">
				<HomeButton handleSelectLibrary={handleSelectLibrary} />
				{libraries.map((library: LibraryData, index: number) => {
					return (
						!library.pinned && (
							<LibraryButton
								library={library}
								index={index}
								handleDragStart={handleDragStart}
								handleDragEnd={handleDragEnd}
								handleDragOver={handleDragOver}
								dragable={true}
								handleSelectLibrary={handleSelectLibrary}
								cm={cm}
							/>
						)
					)
				})}
				<ContextMenu
					model={menuItems}
					ref={cm}
					className={`dropdown-menu ${
						libraryMenuOpen ? " dropdown-menu-open" : ""
					}`}
				/>
				<LeftSectionChangeButton />
			</div>
		</>
	);
}

export default LibrariesList;
