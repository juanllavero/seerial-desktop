import { useDataContext } from "context/data.context";
import { useState, useEffect } from "react";
import "./FolderSelector.scss";
import {
	BackFolderIcon,
	FileIcon,
	FolderIcon,
	HomeFullDefaultIcon,
	HomeIcon,
} from "@components/utils/IconLibrary";
import { useTranslation } from "react-i18next";

// Componente principal
const FolderSelector = () => {
	const { t } = useTranslation();
	const [drives, setDrives] = useState<string[]>([]); // Lista de unidades
	const [folderContent, setFolderContent] = useState<
		{ name: string; isFolder: boolean }[]
	>([]); // Contenido de la carpeta
	const [currentPath, setCurrentPath] = useState<string>(""); // Ruta actual
	const [loading, setLoading] = useState<boolean>(false); // Estado de carga
	const { currentServer } = useDataContext();

	// Fetch para obtener las unidades de disco
	useEffect(() => {
		const fetchDrives = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`http://${currentServer?.ip}:3000/drives`
				);
				const data = await response.json();
				setDrives(data);
			} catch (error) {
				console.error("Error fetching drives:", error);
			}
			setLoading(false);
		};
		fetchDrives();
	}, []);

	// useEffect(() => {
	// 	if (drives && drives.length > 0) {
	// 		handleFolderClick(drives[0]);
	// 	}
	// }, [drives]);

	// Fetch para obtener el contenido de una carpeta
	const fetchFolderContent = async (path: string) => {
		setLoading(true);
		try {
			const response = await fetch(
				`http://${currentServer?.ip}:3000/folder/${path}`
			);
			const data = await response.json();
			setFolderContent(data);
			setCurrentPath(path);
		} catch (error) {
			console.error("Error fetching folder content:", error);
		}
		setLoading(false);
	};

	// Manejador para cuando el usuario selecciona una carpeta o unidad
	const handleFolderClick = (folder: string) => {
		if (folder === ".. [Back]" && !drives.includes(folder)) {
			// Ir a la carpeta superior
			const upperPath = currentPath.split("\\").slice(0, -1).join("\\");
			fetchFolderContent(upperPath || ""); // Si es raíz, reiniciar ruta
		} else {
			fetchFolderContent(`${currentPath}\\${folder}`);
		}
	};

	// Renderizar las unidades o carpetas
	const renderFolderContent = () => {
		if (loading) return <p>Cargando...</p>;

		return (
			<ul>
				{/* Agregar opción para regresar */}
				{currentPath && (
					<li
						onClick={() => handleFolderClick(".. [Back]")}
						style={{ cursor: "pointer" }}
					>
						<BackFolderIcon />
						.. [Back]
					</li>
				)}
				{/* Mostrar carpetas */}
				{folderContent &&
					folderContent.map(
						(item: { name: string; isFolder: boolean }, index) =>
							item.isFolder ? (
								<li
									key={index}
									onClick={() => handleFolderClick(item.name)}
									style={{ cursor: "pointer" }}
								>
									<FolderIcon /> {item.name}
								</li>
							) : (
								<li key={index} style={{ color: "#777" }}>
									<FileIcon /> {item.name}
								</li>
							)
					)}
			</ul>
		);
	};

	const getUserFromPath = (drive: string) => {
		// Utilizamos una expresión regular para capturar la parte después del último separador
		const parts = drive.split(/[\\/]/); // Separar por / o \
		return parts.pop(); // Obtener el último elemento de la ruta
	};

	return (
		<section className="folder-selector">
			<span>Añadir carpeta</span>
			<input
				type="text"
				value={currentPath}
				readOnly
				style={{ width: "100%", marginBottom: "10px" }}
			/>
			<div className="sections">
				<div className="drives-list">
					<ul>
						{drives.length > 0 &&
							drives.map((drive, index) => (
								<li
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
								</li>
							))}
					</ul>
				</div>
				<div className="folder-list">
					{currentPath && renderFolderContent()}
				</div>
			</div>
			<section className="dialog-bottom">
				<button
					className="desktop-dialog-btn"
					onClick={() => console.log("Cancelar")}
				>
					{t("cancelButton")}
				</button>
				<button
					className="btn-app-color"
					onClick={() => console.log("Añadir carpeta:", currentPath)}
				>
					{t("saveButton")}
				</button>
			</section>
		</section>
	);
};

export default FolderSelector;
