import Loading from "@components/utils/Loading";
import { LibraryData } from "@interfaces/LibraryData";
import { setLibraries } from "@redux/slices/dataSlice";
import useFetchArray from "hooks/useFetchArray";
import { useEffect } from "react";
import NoContent from "./noContent/NoContent";
import RightPanel from "./RightPanel";
import LibraryAndSlider from "./utils/LibraryAndSlider";
import { useDispatch } from "react-redux";
import { LeftPanelSections } from "@data/enums/Sections";
import { useSectionContext } from "context/section.context";
import { useDataContext } from "context/data.context";

function RightContent() {
	const dispatch = useDispatch();
	const { currentLeftSection } = useSectionContext();
	const { currentServer } = useDataContext();
	const { data, loading, error } = useFetchArray<LibraryData>(
		`http://${currentServer?.ip}:3000/libraries`,
	);

	useEffect(() => {
		if (data) {
			dispatch(setLibraries(data));
		}
	}, [data]);

	return (
		<>
			{loading ? (
				<Loading />
			) : error ? (
				<NoContent />
			) : (
				<>
					{
						currentLeftSection !== LeftPanelSections.Settings ? (
							<LibraryAndSlider />
						) : null
					}
					
					<RightPanel />
				</>
			)}
		</>
	);
}

export default RightContent;
