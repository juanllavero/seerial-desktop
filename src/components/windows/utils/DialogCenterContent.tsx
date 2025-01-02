import React from 'react'

function DialogCenterContent({children}: {children: React.ReactNode}) {
  return (
    <div className="dialog-center-right scroll">{children}</div>
  )
}

export default DialogCenterContent