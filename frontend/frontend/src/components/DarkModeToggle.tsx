import "./../styles/DarkModeToggle.css";

interface Props {
  dark: boolean;
  onToggle: () => void;
}

export default function DarkModeToggle({ dark, onToggle }: Props) {
  return (
    <button className="dark-toggle" onClick={onToggle}>
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
