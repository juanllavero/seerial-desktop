import DialogCenter from "@components/windows/utils/DialogCenter";
import DialogCenterContent from "@components/windows/utils/DialogCenterContent";
import DialogTemplate from "@components/windows/utils/DialogTemplate";
import { useMetadataContext } from "context/metadata.context";
import React from "react";
import { useTranslation } from "react-i18next";
import VerticalResults from "./utils/VerticalResults";
import IdentificationResult from "./utils/IdentificationResult";
import DialogLoading from "@components/utils/DialogLoading";
import IdentificationSearch from "./utils/IdentificationSearch";

function CorrectIdentification() {
	const { t } = useTranslation();
	const { loaded, showCIWindow, setShowCIWindow, identificationResults } =
		useMetadataContext();

	return (
		<DialogTemplate
			menuOpen={showCIWindow}
			title={t("correctIdentification")}
			cancelAction={() => setShowCIWindow(false)}
		>
			<DialogCenter>
				<DialogCenterContent>
					<IdentificationSearch />
					{loaded &&
					identificationResults &&
					identificationResults.length > 0 ? (
						<VerticalResults>
							{identificationResults.map((result: any) => (
								<IdentificationResult key={result.id} result={result} />
							))}
						</VerticalResults>
					) : (loaded && !identificationResults) ||
					  (loaded && identificationResults.length === 0) ? (
						<span className="no-results">{t('noResults')}</span>
					) : (
						<DialogLoading />
					)}
				</DialogCenterContent>
			</DialogCenter>
		</DialogTemplate>
	);
}

export default React.memo(CorrectIdentification);
