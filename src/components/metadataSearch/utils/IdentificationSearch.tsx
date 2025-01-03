import Input from "@components/form-template/Input";
import { useMetadataContext } from "context/metadata.context";
import React, { useEffect } from "react";
import "./IdentificationSearch.scss";
import { useTranslation } from "react-i18next";
import { RootState } from "@redux/store";
import { useSelector } from "react-redux";

function IdentificationSearch() {
	const { t } = useTranslation();
	const { searchContent, showCIWindow } = useMetadataContext();

	// Show/Movie data to set name and year on first loading
	const selectedLibrary = useSelector(
		(state: RootState) => state.data.selectedLibrary
	);
	const selectedSeries = useSelector(
		(state: RootState) => state.data.selectedSeries
	);
	const selectedSeason = useSelector(
		(state: RootState) => state.data.selectedSeason
	);

	const [name, setName] = React.useState<string>("");
	const [year, setYear] = React.useState<string>("");

	const search = (name: string, year: string) => {
		const onlyNumbers = year.replace(/[^0-9]/g, "");
		searchContent(false, name, onlyNumbers ? parseInt(onlyNumbers) : 1);
	};

	useEffect(() => {
		if (!showCIWindow || !selectedLibrary) return;

		if (selectedLibrary.type === "Movies" && selectedSeason) {
			setName(selectedSeason.name);
			setYear(selectedSeason.year.split("-")[0] || "");
		} else if (selectedLibrary.type === "Shows" && selectedSeries) {
			setName(selectedSeries.name);
			setYear(selectedSeries.year.split("-")[0] || "");
		} else {
			setName("");
			setYear("");
		}
	}, [showCIWindow]);

	return (
		<div className="identification-search">
			<div className="dialog-input">
				<span>{t("name")}</span>
				<Input
					label=""
					value={name}
					placeholder=""
					onChange={(e) => setName(e.currentTarget.value)}
				/>
			</div>
			<div className="dialog-input">
				<span>{t("year")}</span>
				<Input
					label=""
					value={year}
					placeholder=""
					onChange={(e) => setYear(e.target.value)}
				/>
			</div>
			<button className="btn" onClick={() => search(name, year)}>
				{t("searchButton")}
			</button>
		</div>
	);
}

export default IdentificationSearch;
