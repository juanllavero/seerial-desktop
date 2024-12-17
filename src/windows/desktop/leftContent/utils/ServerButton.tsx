import React from 'react'

function ServerButton({ server }: { server: Server }) {
  return (
    <button>
      {server.name}
    </button>
  )
}

export default React.memo(ServerButton)