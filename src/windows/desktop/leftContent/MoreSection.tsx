import { LibraryData } from "@interfaces/LibraryData";
import { ConfirmDialog } from "primereact/confirmdialog";
import { ContextMenu } from "primereact/contextmenu";
import LeftSectionChangeButton from "./utils/LeftSectionChangeButton";
import LibraryButton from "./utils/LibraryButton";
import { RootState } from "@redux/store";
import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDataContext } from "context/data.context";
import ServerButton from "./utils/ServerButton";
import AddServerButton from "./utils/AddServerButton";

function MoreSection({
	cm,
	cmServer,
	handleSelectLibrary,
}: {
	cm: React.MutableRefObject<ContextMenu | null>;
	cmServer: React.MutableRefObject<ContextMenu | null>;
	handleSelectLibrary: (library: LibraryData | null) => void;
}) {
	const { serverList } = useDataContext();
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

	return (
		<>
			<ConfirmDialog />
			<div className="left-container scroll">
				<LeftSectionChangeButton />
				{serverList.map((server) => {
					// Filtrar las bibliotecas que pertenecen al servidor actual
					const serverLibraries = libraries.filter(
						(library) => library.serverIp === server.ip
					);

					return (
						<div key={server.ip}>
							{/* Renderiza el botón del servidor */}
							<ServerButton server={server} cmServer={cmServer}/>

							{/* Renderiza la lista de bibliotecas para este servidor */}
							{serverLibraries.map(
								(library: LibraryData, index: number) =>
									!library.pinned && (
										<LibraryButton
											key={library.id}
											library={library}
											index={index}
											dragable={false}
											handleSelectLibrary={handleSelectLibrary}
											cm={cm}
										/>
									)
							)}
						</div>
					);
					return null;
				})}
            <AddServerButton />
			</div>
		</>
	);
}

export default MoreSection;
