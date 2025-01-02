import React from "react";
import DialogTemplate from "./utils/DialogTemplate";
import { useTranslation } from "react-i18next";
import DialogCenter from "./utils/DialogCenter";
import DialogCenterContent from "./utils/DialogCenterContent";
import DialogBottom from "./utils/DialogBottom";
import { useDispatch, useSelector } from "react-redux";
import { toggleAddServerMenu } from "@redux/slices/contextMenuSlice";
import { useDataContext } from "context/data.context";
import { RootState } from "@redux/store";
import ConfigManager from "@data/utils/Configuration";

function AddServer() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { setServerIP } = useDataContext();
  const configManager = ConfigManager.getInstance();

  const addServerMenu = useSelector(
    (state: RootState) => state.contextMenu.addServerMenu
  );

  const [ip, setIp] = React.useState("");

  return (
    <DialogTemplate
      menuOpen={addServerMenu}
      title={t("addServer")}
      cancelAction={() => dispatch(toggleAddServerMenu())}
    >
      <DialogCenter>
        <DialogCenterContent>
          <span>{t("introduceIp")}</span>
          <input
            type="text"
            placeholder={`Ej. 192.168.1.10`}
            value={ip}
            onChange={(e) => setIp(e.target.value)}
          />
        </DialogCenterContent>
      </DialogCenter>
      <DialogBottom
        cancelAction={() => dispatch(toggleAddServerMenu())}
        acceptAction={() => {
          dispatch(toggleAddServerMenu());
          setServerIP(ip);

          configManager.set("serverIP", ip);
        }} 
      />
    </DialogTemplate>
  );
}

export default React.memo(AddServer);
