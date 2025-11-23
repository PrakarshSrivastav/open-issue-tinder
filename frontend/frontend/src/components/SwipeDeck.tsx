import { useState, useEffect } from "react";
import type { Issue } from "../types";
import "./../styles/SwipeDeck.css";
import IssueCard from "./IssueCard";

interface SwipeDeckProps {
  issues: Issue[];
  onSwipe?: (dir: "left" | "right", issue: Issue) => void;
  loadMore: () => void;
  hasMore: boolean;
}

export default function SwipeDeck({
  issues,
  onSwipe,
  loadMore,
  hasMore,
}: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (issues.length > 0) {
      setCurrentIndex(issues.length - 1); // newest/top
    }
  }, [issues]);

  if (!issues.length) {
    return <p>No issues to swipe. Try different filters.</p>;
  }

  const currentIssue = issues[currentIndex];
  const total = issues.length;
  const position = total - currentIndex; // 1-based from bottom

  const handleSwipe = (dir: "left" | "right") => {
    if (!currentIssue) return;

    if (onSwipe) onSwipe(dir, currentIssue);

    setCurrentIndex((prev) => Math.max(prev - 1, 0));

    // pre-fetch when we're close to the bottom of the stack
    if (hasMore && currentIndex < 5) {
      loadMore();
    }
  };

  return (
    <div className="swipe-container">
      <div className="swipe-topbar">
        <span className="swipe-counter">
          Card {position} / {total}
        </span>
        <span className="swipe-hint">Swipe with buttons below</span>
      </div>

      <div className="swipe-card-wrapper">
        <IssueCard key={currentIssue.id} issue={currentIssue} />
      </div>

      <div className="swipe-buttons">
        <button
          className="swipe-button swipe-button--no"
          onClick={() => handleSwipe("left")}
        >
          ❌
        </button>
        <button
          className="swipe-button swipe-button--yes"
          onClick={() => {
            window.open(currentIssue.htmlUrl, "_blank");
            handleSwipe("right");
          }}
        >
          ✔️
        </button>
      </div>
    </div>
  );
}
