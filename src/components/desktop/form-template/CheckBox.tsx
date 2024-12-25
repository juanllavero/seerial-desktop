function CheckBox({
	label,
	onChange,
	checked,
}: {
	label: string;
	onChange: () => void;
	checked: boolean;
}) {
	return (
		<>
			<input
				id={label}
				type="checkbox"
				checked={checked}
				onChange={onChange}
				name={label}
				className="checkbox"
			/>
			<label htmlFor={label}>{label}</label>
		</>
	);
}

export default CheckBox;
