import { LeftArrowIcon, RightArrowIcon } from "@components/utils/IconLibrary";
import { LeftPanelSections } from "@data/enums/Sections";
import { useSectionContext } from "context/section.context";
import React from "react";

function LeftSectionChangeButton() {
	const { currentLeftSection, setCurrentLeftSection } = useSectionContext();

	return (
		<button
         className="section-change-btn"
         title={currentLeftSection !== LeftPanelSections.Pinned ? "Volver" : "Más"}
			onClick={() => {
				if (currentLeftSection === LeftPanelSections.Pinned) {
					setCurrentLeftSection(LeftPanelSections.More);
				} else {
					setCurrentLeftSection(LeftPanelSections.Pinned);
				}
			}}
		>
			{currentLeftSection === LeftPanelSections.Pinned ? (
				<>
					<span>Más</span>
					<RightArrowIcon />
				</>
			) : (
				<>
					<LeftArrowIcon />
					<span>Volver</span>
				</>
			)}
		</button>
	);
}

export default React.memo(LeftSectionChangeButton);
