import React, { useState, useEffect } from 'react';
import "./../styles/IssueCard.css";
import type { Issue } from "../types";
import {
  VscCircleFilled,
  VscIssues,
  VscPerson,
  VscStarFull,
} from "react-icons/vsc";
import * as api from '../api';


interface MergeStats {
    rate: number;
    mergedCount: number;
    closedNotMergedCount: number;
    totalPullsInPeriod: number;
}


export default function IssueCard({ issue }: { issue: Issue }) {
  const [mergeStats, setMergeStats] = useState<MergeStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMergeStats(null);
    setIsLoading(false);
    setError(null);
  }, [issue.repo.fullName]);

  const difficulty = issue.labels
    .map((l) => l.toLowerCase())
    .find((label) => ["easy", "medium", "hard"].includes(label));

  const language = issue.repo.language ?? "Unknown";

  const languageColor =
    language === "JavaScript"
      ? "#f1e05a"
      : language === "TypeScript"
      ? "#2b7489"
      : language === "Python"
      ? "#3572A5"
      : language === "Java"
      ? "#b07219"
      : language === "C#"
      ? "#178600"
      : language === "C++"
      ? "#f34b7d"
      : language === "Go"
      ? "#00ADD8"
      : language === "Ruby"
      ? "#701516"
      : language === "PHP"
      ? "#4F5D95"
      : language === "Swift"
      ? "#ffac45"
      : language === "Kotlin"
      ? "#F18E33"
      : language === "Rust"
      ? "#dea584"
      : language === "Dart"
      ? "#00B4AB"
      : "#ccc";

  const handleShowMergeRate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [owner, repo] = issue.repo.fullName.split('/');
      const stats = await api.getMergeStats(owner, repo);
      setMergeStats(stats);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <article className="issue-card">
      <header className="issue-header">
        <div className="issue-header-text">
          <h3 className="issue-title">{issue.title}</h3>
          <p className="issue-repo">{issue.repo.fullName}</p>
        </div>

        <div className="issue-stars-pill">
          <VscStarFull size={16} />
          <span>{issue.repo.stars}</span>
        </div>
      </header>

      <section className="issue-meta-row">
        <div className="issue-meta-block">
          <span className="issue-meta-label">Language</span>
          <div className="issue-meta-value">
            <VscCircleFilled size={18} color={languageColor} />
            <span>{language}</span>
          </div>
        </div>

        <div className="issue-meta-block">
          <span className="issue-meta-label">Comments</span>
          <div className="issue-meta-value">
            <VscIssues size={18} />
            <span>{issue.comments}</span>
          </div>
        </div>

        {difficulty && (
          <div className="issue-meta-block">
            <span className="issue-meta-label">Difficulty</span>
            <div
              className={`issue-difficulty issue-difficulty--${difficulty}`}
            >
              {difficulty}
            </div>
          </div>
        )}
      </section>

      {issue.labels.length > 0 && (
        <section className="issue-tags-section">
          <span className="issue-meta-label">Tags</span>
          <div className="issue-tags">
            {issue.labels.slice(0, 4).map((label) => (
              <span className="issue-tag" key={label}>
                {label}
              </span>
            ))}
          </div>
        </section>
      )}

      <footer className="issue-footer">
        <div className="issue-author">
          {issue.user.avatarUrl && (
            <img
              src={issue.user.avatarUrl}
              alt={issue.user.login}
              className="issue-author-avatar"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}

          <div className="issue-author-text">
            <span className="issue-meta-label">Author</span>
            <div className="issue-author-main">
              <VscPerson size={16} />
              <a
                href={issue.user.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="issue-author-link"
              >
                @{issue.user.login}
              </a>
            </div>
          </div>
        </div>

        <div className="merge-stats-container">
            {!mergeStats && !isLoading && (
                <button onClick={handleShowMergeRate} disabled={isLoading}>
                Show 90-day Merge Rate
                </button>
            )}
            {isLoading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            {mergeStats && (
                <div className="merge-stats-details">
                    <p>
                    <strong>Acceptance Rate:</strong> {(mergeStats.rate * 100).toFixed(2)}%
                    </p>
                    <p>
                    ({mergeStats.mergedCount} merged / {mergeStats.mergedCount + mergeStats.closedNotMergedCount} closed PRs from last 90 days)
                    </p>
                </div>
            )}
        </div>

        <a
          className="issue-link-btn"
          href={issue.htmlUrl}
          target="_blank"
          rel="noreferrer"
        >
          View on GitHub →
        </a>
      </footer>
    </article>
  );
}

