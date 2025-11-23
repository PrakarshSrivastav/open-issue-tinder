import sys, os, json
from datetime import datetime, timedelta, timezone
from github import Github, Auth, GithubException

DATE_FMT = "%Y-%m-%d"

def since_date(days: int) -> str:
    return (datetime.now(timezone.utc) - timedelta(days=days)).strftime(DATE_FMT)

def get_merge_rate(owner: str, repo: str, token: str, window_days: int = 90) -> dict:
    try:
        g = Github(auth=Auth.Token(token))
        repo_qual = f"repo:{owner}/{repo}"

        # ---- server-side filtered counts ----
        created = g.search_issues(f"{repo_qual} is:pr created:>={since_date(window_days)}")
        merged  = g.search_issues(f"{repo_qual} is:pr merged:>={since_date(window_days)}")
        closed_not_merged = g.search_issues(
            f"{repo_qual} is:pr is:closed -merged created:>={since_date(window_days)}"
        )

        merged_cnt  = merged.totalCount
        closed_cnt  = closed_not_merged.totalCount
        total_closed = merged_cnt + closed_cnt
        rate = merged_cnt / total_closed if total_closed else 0.0

        return {
            "rate": round(rate, 4),
            "mergedCount": merged_cnt,
            "closedNotMergedCount": closed_cnt,
            "totalPullsInPeriod": created.totalCount,
        }
    except GithubException as e:
        return {"error": e.data.get("message", "GitHub API error")}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Owner and repo name required"}))
        sys.exit(1)

    token = os.getenv("GITHUB_TOKEN")
    if not token:
        print(json.dumps({"error": "GITHUB_TOKEN not set"}))
        sys.exit(1)

    print(json.dumps(get_merge_rate(sys.argv[1], sys.argv[2], token)))