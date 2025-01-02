import { useDataContext } from "context/data.context";
import { useState, useEffect } from "react";
import "./FolderSelector.scss";
import {
	BackFolderIcon,
	FileIcon,
	FolderIcon,
	HomeFullDefaultIcon,
} from "@components/utils/IconLibrary";
import { useTranslation } from "react-i18next";
import { toggleFolderSelectionMenu } from "@redux/slices/contextMenuSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import useFetch from "hooks/useFetch";
import DialogCenter from "./utils/DialogCenter";
import DialogCenterContent from "./utils/DialogCenterContent";
import DialogBottom from "./utils/DialogBottom";
import DialogTemplate from "./utils/DialogTemplate";

// Componente principal
const FolderSelector = ({ onAccept }: { onAccept: (path: string) => void }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { fetchData, loading } = useFetch();
	const [drives, setDrives] = useState<string[]>([]); // Lista de unidades
	const [folderContent, setFolderContent] = useState<
		{ name: string; isFolder: boolean }[]
	>([]); // Contenido de la carpeta
	const [currentPath, setCurrentPath] = useState<string>(""); // Ruta actual
	const { serverIP } = useDataContext();

	const folderSelectMenuOpen = useSelector(
		(state: RootState) => state.contextMenu.folderSelectionMenu
	);

	// Fetch para obtener las unidades de disco
	useEffect(() => {
		if (folderSelectMenuOpen) {
			fetchData(
				`https://${serverIP}/drives`,
				(data) => setDrives(data),
				(err) => console.error("Error fetching drives:", err)
			);
		}
	}, [folderSelectMenuOpen]);

	// Fetch para obtener el contenido de una carpeta
	const fetchFolderContent = async (path: string) => {
		fetchData(
			`https://${serverIP}/folder/${encodeURIComponent(path)}`,
			(data) => {
				setFolderContent(data);
				setCurrentPath(path);
			},
			(_err) => setFolderContent([])
		);
	};

	// Manejador para cuando el usuario selecciona una carpeta o unidad
	const handleFolderClick = (folder: string) => {
		if (folder === ".. [Back]") {
			if (drives.includes(currentPath)) return;

			const upperPath = currentPath.split("\\").slice(0, -1).join("\\");
			fetchFolderContent(upperPath || ""); // Si es raíz, reiniciar ruta
		} else {
			fetchFolderContent(`${currentPath}\\${folder}`);
		}
	};

	// Renderizar las unidades o carpetas
	const renderFolderContent = () => {
		if (loading) return <p>Loading...</p>;

		return (
			<>
				{/* Go Back button */}
				{currentPath && (
					<span
						onClick={() => handleFolderClick(".. [Back]")}
						style={{ cursor: "pointer" }}
					>
						<BackFolderIcon />
						.. [Back]
					</span>
				)}

				{/* Folders */}
				{folderContent &&
					folderContent.map(
						(item: { name: string; isFolder: boolean }, index) =>
							item.isFolder ? (
								<span
									key={index}
									onClick={() => handleFolderClick(item.name)}
									style={{ cursor: "pointer" }}
								>
									<FolderIcon /> {item.name}
								</span>
							) : (
								<span key={index} className="disabled">
									<FileIcon /> {item.name}
								</span>
							)
					)}
			</>
		);
	};

	/**
	 * Extracts the username from the given path.
	 * @param {string} path
	 * @returns {string} the username
	 */
	const getUserFromPath = (path: string) => {
		const parts = path.split(/[\\/]/);
		return parts.pop();
	};

	return (
		<DialogTemplate
			menuOpen={folderSelectMenuOpen}
			title={t("folders")}
			secondary
			cancelAction={() => dispatch(toggleFolderSelectionMenu())}
		>
			<DialogCenter>
				<DialogCenterContent>
					<span>Añadir carpeta</span>
					<input
						type="text"
						value={currentPath}
						readOnly
						style={{ width: "100%", marginBottom: "10px" }}
					/>
					<div className="sections">
						<div className="drives-list">
							{drives.length > 0 &&
								drives.map((drive, index) => (
									<span
										key={index}
										onClick={() => fetchFolderContent(drive)}
										style={{ cursor: "pointer" }}
									>
										{index === 0 ? (
											<HomeFullDefaultIcon />
										) : (
											<FolderIcon />
										)}{" "}
										{index === 0 ? getUserFromPath(drive) : drive}
									</span>
								))}
						</div>
						<div className="folder-list">
							{currentPath && renderFolderContent()}
						</div>
					</div>
				</DialogCenterContent>
			</DialogCenter>
			<DialogBottom
				cancelAction={() => dispatch(toggleFolderSelectionMenu())}
				acceptAction={() => {
					dispatch(toggleFolderSelectionMenu());
					
					if (currentPath && currentPath !== "") {
						onAccept(currentPath);
					}
				}}
			/>
		</DialogTemplate>
	);
};

export default FolderSelector;
