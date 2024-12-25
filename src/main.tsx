import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import MainDesktop from "./windows/desktop/MainDesktop";
import { store } from "./redux/store";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "./index.scss";
import { SectionProvider } from "context/section.context";
import { DownloadProvider } from "context/download.context";
import { DataProvider } from "context/data.context";
import { SettingsProvider } from "context/settings.context";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<PrimeReactProvider>
		<Provider store={store}>
			<SectionProvider>
				<DownloadProvider>
					<DataProvider>
						<SettingsProvider>
							<MainDesktop />
						</SettingsProvider>
					</DataProvider>
				</DownloadProvider>
			</SectionProvider>
		</Provider>
	</PrimeReactProvider>
);
