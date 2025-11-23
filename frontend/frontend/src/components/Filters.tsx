import { VscRepo } from 'react-icons/vsc';
import '../styles/Filters.css';

interface Props {
  language: string;
  onLanguageChange: (l: string) => void;
  sort: 'asc' | 'desc';
  onSortChange: (s: 'asc' | 'desc') => void;
}

export default function Filters({
  language,
  onLanguageChange,
  sort,
  onSortChange,
}: Props) {
  const languages = [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'C#',
    'C++',
    'Go',
    'Ruby',
    'PHP',
    'Swift',
    'Kotlin',
    'Rust',
    'Dart',
    'HTML',
    'CSS',
  ];

  return (
    <header className="filters">
      <div className="filters-header">
        <VscRepo size={40} className="filters-icon" aria-hidden="true" />
        <div className="filters-title">
          <h1>Open-Source Issue Finder</h1>
          <p>Discover your next contribution in seconds</p>
        </div>
      </div>

      <div className="filters-controls">
        <label htmlFor="language" className="visually-hidden">
          Programming language
        </label>
        <select
          id="language"
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

        <label htmlFor="sort" className="visually-hidden">
          Sort order
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as 'asc' | 'desc')}
        >
          <option value="desc">Most starred</option>
          <option value="asc">Least starred</option>
        </select>
      </div>
    </header>
  );
}