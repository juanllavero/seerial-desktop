import {
	ShowsIcon,
	MoviesIcon,
	MusicIcon,
	VerticalDotsIcon,
} from "@components/utils/IconLibrary";
import { LibraryData } from "@interfaces/LibraryData";
import {
	closeAllMenus,
	toggleLibraryMenu,
} from "@redux/slices/contextMenuSlice";
import { setLibraryForMenu } from "@redux/slices/dataSlice";
import { RootState } from "@redux/store";
import { ContextMenu } from "primereact/contextmenu";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function LibraryButton({
	library,
	index,
	handleDragStart,
	handleDragEnd,
	handleDragOver,
	dragable,
	handleSelectLibrary,
	cm,
}: {
	library: LibraryData;
	index: number;
	handleDragStart?: (index: number) => void;
	handleDragEnd?: () => void;
	handleDragOver?: (index: number, e: React.DragEvent) => void;
	dragable: boolean;
	handleSelectLibrary: (library: LibraryData | null) => void;
	cm: React.MutableRefObject<ContextMenu | null>;
}) {
	const dispatch = useDispatch();
	const selectedLibrary = useSelector(
		(state: RootState) => state.data.selectedLibrary
	);
	const libraryForMenu = useSelector(
		(state: RootState) => state.data.libraryForMenu
	);
	const libraryMenuOpen = useSelector(
		(state: RootState) => state.contextMenu.libraryMenu
	);

	return (
		<button
			key={library.id}
			className={`libraries-button ${
				library === selectedLibrary ? "selected" : ""
			}`}
			title={library.name}
			draggable={dragable}
			onDragStart={
				dragable && handleDragStart
					? () => handleDragStart(index)
					: undefined
			}
			onDragEnd={
				dragable && handleDragEnd ? () => handleDragEnd() : undefined
			}
			onDragOver={
				dragable && handleDragOver
					? (e) => handleDragOver(index, e)
					: undefined
			}
		>
			{library.type === "Shows" ? (
				<ShowsIcon onClick={() => handleSelectLibrary(library)} />
			) : library.type === "Movies" ? (
				<MoviesIcon onClick={() => handleSelectLibrary(library)} />
			) : (
				<MusicIcon onClick={() => handleSelectLibrary(library)} />
			)}
			<span
				className="library-name"
				onClick={() => handleSelectLibrary(library)}
			>
				{library.name}
			</span>

			<div>
				<a
					id={library.id + "btn"}
					className={`svg-button-desktop-transparent select ${
						libraryMenuOpen && library == libraryForMenu
							? " active-btn"
							: " inactive-btn"
					}`}
					onClick={(e) => {
						dispatch(closeAllMenus());

						if (!libraryMenuOpen || library != libraryForMenu) {
							dispatch(toggleLibraryMenu());
							dispatch(setLibraryForMenu(library));
							cm.current?.show(e);
						}
					}}
				>
					<VerticalDotsIcon />
				</a>
			</div>
		</button>
	);
}

export default React.memo(LibraryButton);
