import "./../styles/Filters.css";
import { VscGithubInverted } from "react-icons/vsc";

interface Props {
  language: string;
  onLanguageChange: (l: string) => void;
  sort: "asc" | "desc";
  onSortChange: (s: "asc" | "desc") => void;
}

export default function Filters({
  language,
  onLanguageChange,
  sort,
  onSortChange,
}: Props) {
  const languages = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C#",
    "C++",
    "Go",
    "Ruby",
    "PHP",
    "Swift",
    "Kotlin",
    "Rust",
    "Dart",
    "HTML",
    "CSS",
  ];

  return (
    <div className="filters">
      <div className="filters-header">
        <VscGithubInverted size={40} />
        <div className="filters-title">
          <h1>Open Issue Tinder</h1>
          <p>Swipe your next contribution</p>
        </div>
      </div>
      <div className="filters-controls">
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          <option value="">All Languages</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as "asc" | "desc")}
        >
          <option value="desc">Stars: High → Low</option>
          <option value="asc">Stars: Low → High</option>
        </select>
      </div>
    </div>
  );
}
