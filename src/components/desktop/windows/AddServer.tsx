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

function AddServer() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { serverList, setServerList } = useDataContext();

  const addServerMenu = useSelector(
    (state: RootState) => state.contextMenu.addServerMenu
  );

  const [name, setName] = React.useState("");
  const [ip, setIp] = React.useState("");

  const handleIpChange = (value: string) => {
    if (value.length <= 15 && /^[0-9.]*$/.test(value)) {
      setIp(value);
    }
  };

  return (
    <DialogTemplate
      menuOpen={addServerMenu}
      title={t("addServer")}
      cancelAction={() => dispatch(toggleAddServerMenu())}
    >
      <DialogCenter>
        <DialogCenterContent>
          <span>{t("name")}</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <span>{t("introduceIp")}</span>
          <input
            type="text"
            placeholder={`Ej. 192.168.1.10`}
            value={ip}
            onChange={(e) => handleIpChange(e.target.value)}
          />
        </DialogCenterContent>
      </DialogCenter>
      <DialogBottom
        cancelAction={() => dispatch(toggleAddServerMenu())}
        acceptAction={() => {
          dispatch(toggleAddServerMenu());
          setServerList([...serverList, { name: name, ip: ip, online: false }]);
        }}
      />
    </DialogTemplate>
  );
}

export default React.memo(AddServer);
