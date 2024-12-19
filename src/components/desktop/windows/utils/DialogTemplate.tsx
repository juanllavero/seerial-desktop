import DialogBox from "./DialogBox";
import DialogTop from "./DialogTop";

function DialogTemplate({
	menuOpen,
	title,
	cancelAction,
   secondary,
	children,
}: {
	menuOpen: boolean;
	title: string;
   secondary?: boolean;
	cancelAction: () => void;
	children: React.ReactNode;
}) {
	return (
		<section className={`dialog ${menuOpen ? " dialog-active" : ""}`} style={{ zIndex: !secondary ? 100 : 200 }}>
			<div className={secondary ? "popUp-dialog-background" : "dialog-background"} onClick={cancelAction}></div>
			<DialogBox>
				<DialogTop title={title} action={cancelAction} />
				{children}
			</DialogBox>
		</section>
	);
}

export default DialogTemplate;
