import { WindowSections } from "@data/enums/Sections";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeMenuSection } from "redux/slices/menuSectionsSlice";
import { RootState } from "redux/store";
import { addLibrary, toggleLibraryEditWindow } from "redux/slices/dataSlice";
import { useTranslation } from "react-i18next";
import { Library } from "@objects/Library";
import {
	MoviesIcon,
	MusicIcon,
	ShowsIcon,
} from "@components/utils/IconLibrary";
import FolderSelector from "./FolderSelector";
import { toggleFolderSelectionMenu } from "@redux/slices/contextMenuSlice";
import DialogBottom from "./utils/DialogBottom";
import DialogTemplate from "./utils/DialogTemplate";
import DialogCenter from "./utils/DialogCenter";
import DialogCenterLeftPanel from "./utils/DialogCenterLeftPanel";
import DialogCenterContent from "./utils/DialogCenterContent";
import { useSettingsContext } from "context/settings.context";
import { useDataContext } from "context/data.context";

function LibraryWindow() {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { i18n } = useTranslation();
	const [name, setName] = useState<string>("");
	const [type, setType] = useState<string>("Movies");
	const [folders, setFolders] = useState<string[]>([]);
	const [language, setLanguage] = useState<string>(i18n.language);
	const [addLibraryMode, setAddLibraryMode] = useState<boolean>(true);

	const { serverIP } = useDataContext();
	const { getLanguageName } = useSettingsContext();

	const menuSection = useSelector(
		(state: RootState) => state.sectionState.menuSection
	);
	const libraryMenuOpen = useSelector(
		(state: RootState) => state.data.libraryEditWindow
	);
	const selectedLibrary = useSelector(
		(state: RootState) => state.data.libraryForMenu
	);

	const supportedLanguages = Array.isArray(i18n.options?.supportedLngs)
		? i18n.options.supportedLngs.filter((lng) => lng !== "cimode")
		: [];

	const handleSelectFolder = async (newFolder: string) => {
		const newFolders = [...folders, newFolder].filter(
			(folder) => !folders.includes(folder)
		);
		if (newFolders.length > 0) {
			setFolders((prevFolders) => [...prevFolders, ...newFolders]);
		}
	};

	const handleRemoveFolder = (folderToRemove: string) => {
		setFolders((prevFolders) =>
			prevFolders.filter((folder) => folder !== folderToRemove)
		);
	};

	const handleLanguageChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const selectedLanguage = event.target.value;
		setLanguage(selectedLanguage);
		//i18n.changeLanguage(selectedLanguage);  // Cambia el idioma en i18next
	};

	const handleSave = async () => {
		if (folders.length === 0) {
			console.log("Error folder");
		} else {
			if (addLibraryMode) {
				const newLibrary = new Library(name, language, type, 0, folders);

				// Add library
				fetch(`https://${serverIP}/addLibrary`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(newLibrary.toLibraryData()),
				});
			} else if (selectedLibrary) {
				selectedLibrary.name = name;
				selectedLibrary.language = language;
				selectedLibrary.folders = folders;

				// Scan library
				fetch(`https://${serverIP}/scanLibrary/${selectedLibrary.id}`);
			}
		}

		dispatch(toggleLibraryEditWindow());
	};

	useEffect(() => {
		dispatch(changeMenuSection(WindowSections.General));
		if (selectedLibrary) {
			setLanguage(selectedLibrary.language);
			setFolders(selectedLibrary.folders);
			setName(selectedLibrary.name);
			setType(selectedLibrary.type);
			setAddLibraryMode(false);
		} else {
			setLanguage(i18n.language);
			setType("Movies");
			setName(t("movies"));
			setFolders([]);
		}
	}, [libraryMenuOpen]);

	return (
		<DialogTemplate
			menuOpen={libraryMenuOpen}
			title={
				selectedLibrary
					? t("libraryWindowTitleEdit")
					: t("libraryWindowTitle")
			}
			cancelAction={() => dispatch(toggleLibraryEditWindow())}
		>
			<FolderSelector onAccept={handleSelectFolder} />
			<DialogCenter>
				<DialogCenterLeftPanel>
					<button
						className={`desktop-dialog-side-btn ${
							menuSection === WindowSections.General
								? " desktop-dialog-side-btn-active"
								: ""
						}`}
						onClick={() =>
							dispatch(changeMenuSection(WindowSections.General))
						}
					>
						{t("generalButton")}
					</button>
					<button
						className={`desktop-dialog-side-btn ${
							menuSection === WindowSections.Folders
								? " desktop-dialog-side-btn-active"
								: ""
						}`}
						onClick={() =>
							dispatch(changeMenuSection(WindowSections.Folders))
						}
					>
						{t("folders")}
					</button>
				</DialogCenterLeftPanel>
				<DialogCenterContent>
					{menuSection == WindowSections.General ? (
						<>
							<span>{t("type")}</span>
							<div className="dialog-library-type-box">
								<button
									className={`dialog-library-btn ${
										selectedLibrary
											? selectedLibrary.type === "Movies"
												? " dialog-library-btn-active"
												: "dialog-library-btn-disabled"
											: type === "Movies"
											? " dialog-library-btn-active"
											: ""
									}`}
									onClick={() => {
										setType("Movies");
										setName(t("movies"));
									}}
								>
									<MoviesIcon />
									<span>{t("movies")}</span>
								</button>
								<button
									className={`dialog-library-btn ${
										selectedLibrary
											? selectedLibrary.type === "Shows"
												? " dialog-library-btn-active"
												: "dialog-library-btn-disabled"
											: type === "Shows"
											? " dialog-library-btn-active"
											: ""
									}`}
									onClick={() => {
										setType("Shows");
										setName(t("shows"));
									}}
								>
									<ShowsIcon />
									<span>{t("shows")}</span>
								</button>
								<button
									className={`dialog-library-btn ${
										selectedLibrary
											? selectedLibrary.type === "Music"
												? " dialog-library-btn-active"
												: "dialog-library-btn-disabled"
											: type === "Music"
											? " dialog-library-btn-active"
											: ""
									}`}
									onClick={() => {
										setType("Music");
										setName(t("music"));
									}}
								>
									<MusicIcon />
									<span>{t("music")}</span>
								</button>{" "}
							</div>
							<section className="dialog-horizontal-box">
								<div className="dialog-input-box">
									<span>{t("name")}</span>
									<input
										type="text"
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</div>
								<div className="dialog-input-box">
									<span>{t("languageText")}</span>
									<select
										value={language}
										onChange={handleLanguageChange}
									>
										{supportedLanguages.map((lng: string) => (
											<option key={lng} value={lng}>
												{getLanguageName(lng) || lng}
											</option>
										))}
									</select>
								</div>
							</section>
						</>
					) : menuSection == WindowSections.Folders ? (
						<>
							<span>{t("addFolderText")}</span>
							<ul className="folder-list">
								{folders.map((folder, index) => (
									<li key={index}>
										{folder}
										<button
											className="svg-button-desktop-transparent"
											onClick={() => handleRemoveFolder(folder)}
										>
											<img
												src="./src/assets/svg/windowClose.svg"
												style={{
													width: "20px",
													height: "20px",
													filter:
														"drop-shadow(2px 1px 2px rgb(0 0 0 / 0.5))",
												}}
											/>
										</button>
									</li>
								))}
							</ul>
							<button
								className="desktop-dialog-btn add-folder-btn"
								onClick={() => dispatch(toggleFolderSelectionMenu())}
							>
								{t("addFolder")}
							</button>
						</>
					) : (
						<></>
					)}
				</DialogCenterContent>
			</DialogCenter>
			<DialogBottom cancelAction={() => dispatch(toggleLibraryEditWindow())}>
				<button
					className="btn-app-color"
					onClick={
						menuSection === WindowSections.General
							? () => dispatch(changeMenuSection(WindowSections.Folders))
							: () => handleSave()
					}
				>
					{menuSection === WindowSections.General
						? `${t("next")}`
						: `${t("saveButton")}`}
				</button>
			</DialogBottom>
		</DialogTemplate>
	);
}

export default LibraryWindow;
