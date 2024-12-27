import "./SettingsButton.scss"

function SettingsButton({text, action, active} : {text: string; action: () => void, active: boolean}) {
  return (
    <button className={`settings-btn ${active ? "settings-btn-active" : ""}`} title={text} onClick={action}>
      {text}
    </button>
  )
}

export default SettingsButton