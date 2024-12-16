import Loading from "@components/utils/Loading";
import { LibraryData } from "@interfaces/LibraryData";
import { setLibraries } from "@redux/slices/dataSlice";
import useFetchArray from "hooks/useFetch";
import { useEffect } from "react";
import NoContent from "./noContent/NoContent";
import RightPanel from "./RightPanel";
import LibraryAndSlider from "./utils/LibraryAndSlider";
import { useDispatch } from "react-redux";

function RightContent() {
	const dispatch = useDispatch();
	const { data, loading, error } = useFetchArray<LibraryData>(
		"http://192.168.1.45:3000/libraries"
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
					<LibraryAndSlider />
					<RightPanel />
				</>
			)}
		</>
	);
}

export default RightContent;
