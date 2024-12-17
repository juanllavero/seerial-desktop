import { ServerIcon } from '@components/utils/IconLibrary'
import React from 'react'
import "./ServerButton.scss"

function ServerButton({ server }: { server: Server }) {
  return (
    <button className="server-btn">
      <ServerIcon />
      <span>{server.name}</span>
    </button>
  )
}

export default React.memo(ServerButton)