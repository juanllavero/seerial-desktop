import { useDispatch, useSelector } from "react-redux";
import { setLibraries } from "../../../redux/slices/dataSlice";
import { RootState } from "../../../redux/store";
import { useEffect, useRef } from "react";
import { ContextMenu } from "primereact/contextmenu";
import { ConfirmDialog } from "primereact/confirmdialog";
import { LibraryData } from "@interfaces/LibraryData";
import "./LibrariesList.scss";
import LibraryButton from "./utils/LibraryButton";
import HomeButton from "./utils/HomeButton";
import AddLibraryButton from "./utils/AddLibraryButton";
import { useDataContext } from "context/data.context";

/**
 * A component that displays a list of libraries and allows the user to select a library,
 * open the library menu, edit the library, update the library, and remove the library.
 *
 * @returns A JSX element that displays the list of libraries.
 */
function LibrariesList({
	cm,
	handleSelectLibrary,
}: {
	cm: React.MutableRefObject<ContextMenu | null>;
	handleSelectLibrary: (library: LibraryData | null) => void;
}) {
	const dispatch = useDispatch();
	const { serverIP, apiKeyStatus } = useDataContext();
	const libraries = useSelector((state: RootState) => state.data.libraries);
	const selectedLibrary = useSelector(
		(state: RootState) => state.data.selectedLibrary
	);
	const previousLibraryId = useRef<string | null>(null);

	// This useEffect is needed to update the right panel when the selected library changes
	useEffect(() => {
		if (selectedLibrary && selectedLibrary.id !== previousLibraryId.current) {
			handleSelectLibrary(selectedLibrary);
			previousLibraryId.current = selectedLibrary.id;
		}
	}, [selectedLibrary]);

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
					);
				})}

				{serverIP !== "" && apiKeyStatus && <AddLibraryButton />}
			</div>
		</>
	);
}

export default LibrariesList;
