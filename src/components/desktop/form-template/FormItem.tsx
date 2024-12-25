import React from "react";

function FormItem({
	label,
	children,
   bottomText,
}: {
	label?: string;
	children: React.ReactNode;
   bottomText?: string;
}) {
	return (
		<div className="form-item">
			<div className="form-item-horizontal">
            {label && <span className="form-item-label">{label}</span>}
            {children}
         </div>
         {bottomText && <span className="form-item-bottom-text">{bottomText}</span>}
		</div>
	);
}

export default FormItem;
