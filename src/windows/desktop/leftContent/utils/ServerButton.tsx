import {
	AddIcon,
	ServerIcon,
	VerticalDotsIcon,
} from "@components/utils/IconLibrary";
import React from "react";
import "./ServerButton.scss";
import { ContextMenu } from "primereact/contextmenu";
import { useDataContext } from "context/data.context";
import {
	closeAllMenus,
	toggleServerMenu,
} from "@redux/slices/contextMenuSlice";
import { RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { toggleLibraryEditWindow } from "@redux/slices/dataSlice";

function ServerButton({
	server,
	cmServer,
}: {
	server: Server;
	cmServer: React.MutableRefObject<ContextMenu | null>;
}) {
	const dispatch = useDispatch();
	const { serverForMenu, setServerForMenu } = useDataContext();
	const serverMenuOpen = useSelector(
		(state: RootState) => state.contextMenu.serverMenu
	);

	return (
		<button className="server-btn" title={server.name}
			onClick={() => setServerForMenu(server)}>
			<ServerIcon />
			<span>{server.name}</span>

			<div className="server-btn-options">
				<button
					className={`svg-button-desktop-transparent select`}
					onClick={() => dispatch(toggleLibraryEditWindow())}
				>
					<AddIcon />
				</button>
				<a
					id={server.ip + "btn"}
					className={`svg-button-desktop-transparent select`}
					onClick={(e) => {
						dispatch(closeAllMenus());

						if (!serverMenuOpen || server != serverForMenu) {
							dispatch(toggleServerMenu());
							setServerForMenu(server);
							cmServer.current?.show(e);
						}
					}}
				>
					<VerticalDotsIcon />
				</a>
			</div>
		</button>
	);
}

export default React.memo(ServerButton);
