import "./SettingsButton.scss"

function SettingsButton({text, action} : {text: string; action: () => void}) {
  return (
    <button className="settings-btn" title={text} onClick={action}>
      {text}
    </button>
  )
}

export default SettingsButton