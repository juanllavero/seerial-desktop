function DialogTop({ title, action }: { title: string; action: () => void }) {
	return (
		<section className="dialog-top">
			<span>{title}</span>
			<button className="close-window-btn" onClick={action}>
				<img
					src="./src/assets/svg/windowClose.svg"
					style={{
						width: "24px",
						height: "24px",
						filter: "drop-shadow(2px 1px 2px rgb(0 0 0 / 0.5))",
					}}
				/>
			</button>
		</section>
	);
}

export default DialogTop;
