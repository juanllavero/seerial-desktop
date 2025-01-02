import React from "react";

function Select({
	value,
	onChange,
	children,
}: {
	value: string;
	onChange: React.ChangeEventHandler<HTMLSelectElement>;
	children: React.ReactNode;
}) {
	return (
		<select value={value} onChange={onChange}>
			{children}
		</select>
	);
}

export default Select;
