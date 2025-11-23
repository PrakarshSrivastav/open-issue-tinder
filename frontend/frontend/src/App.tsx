import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

import Filters from "./components/Filters";
import IssueCard from "./components/IssueCard";
import SwipeDeck from "./components/SwipeDeck";
import DarkModeToggle from "./components/DarkModeToggle";
import { useIssues } from "./hooks/useIssues";

type ViewMode = "list" | "swipe";

export default function App() {
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<ViewMode>("swipe");
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  const { issues, loading, error, hasMore, loadMore } = useIssues(
    language,
    sort
  );

  const observer = useRef<IntersectionObserver | null>(null);
  const lastIssueElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
  }, [dark]);

  return (
    <div className={`App ${dark ? "App-dark" : ""}`}>
      <main className="main-content">
        <header className="top-bar">
          <div className="top-bar-right">
            <button
              className="view-toggle"
              onClick={() =>
                setViewMode((prev) => (prev === "swipe" ? "list" : "swipe"))
              }
            >
              {viewMode === "swipe" ? "📋 List view" : "🃏 Swipe view"}
            </button>

            <DarkModeToggle dark={dark} onToggle={() => setDark((d) => !d)} />
          </div>
        </header>

        <Filters
          language={language}
          onLanguageChange={setLanguage}
          sort={sort}
          onSortChange={setSort}
        />

        {error && <p>Error: {error.message}</p>}

        {viewMode === "swipe" ? (
          <SwipeDeck
            issues={issues}
            onSwipe={(dir, issue) => {
              console.log("Swiped", dir, "on", issue.repo.fullName);
            }}
            loadMore={loadMore}
            hasMore={hasMore}
          />
        ) : (
          <div className="cards">
            {issues.map((issue, index) => {
              if (issues.length === index + 1) {
                return (
                  <div ref={lastIssueElementRef} key={issue.id}>
                    <IssueCard issue={issue} />
                  </div>
                );
              } else {
                return <IssueCard key={issue.id} issue={issue} />;
              }
            })}
          </div>
        )}
        {loading && <p>Loading...</p>}
        {!loading && !error && issues.length === 0 && (
          <p>No issues found. Try different filters.</p>
        )}
      </main>
    </div>
  );
}
