import { AddIcon } from "@components/utils/IconLibrary";
import React from "react";
import "./AddServerButton.scss";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { toggleAddServerMenu } from "@redux/slices/contextMenuSlice";

function AddServerButton() {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	return (
		<button className="add-server-btn" title={t('addServer')}
			onClick={() => dispatch(toggleAddServerMenu())}>
			<AddIcon />
			<span>{t('addServer')}</span>
		</button>
	);
}

export default React.memo(AddServerButton);
