import React from "react";

function DialogBox({ children }: { children: React.ReactNode }) {
   return <div className="dialog-box">{children}</div>;
}

export default DialogBox;