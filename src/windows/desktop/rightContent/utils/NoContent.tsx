import { toggleLibraryEditWindow } from "@redux/slices/dataSlice";
import { t } from "i18next";
import StatusRightPanelMessage from "../StatusRightPanelMessage";
import { useDispatch } from "react-redux";

function NoContent() {
	const dispatch = useDispatch();
	return (
		<StatusRightPanelMessage
			title={t("noLibraryFound")}
			subtitle={t("addLibraryMessage")}
			containsButton={true}
			action={() => dispatch(toggleLibraryEditWindow())}
			buttonText={t("libraryWindowTitle")}
		/>
	);
}

export default NoContent;
