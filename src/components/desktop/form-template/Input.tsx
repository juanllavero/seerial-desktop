import React from "react";

function Input({
	label,
	value,
	placeholder,
	onChange,
}: {
	label: string;
	value: string;
	placeholder: string;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
	return (
		<div className="form-vertical-input">
			<span>{label}</span>
			<input
				type="text"
				value={value}
				placeholder={placeholder}
				onChange={onChange}
			/>
		</div>
	);
}

export default Input;
