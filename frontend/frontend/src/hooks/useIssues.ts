import { useEffect, useReducer, useCallback } from "react";
import { fetchIssues } from "../api";
import type { Issue } from "../types";

type State = {
  issues: Issue[];
  loading: boolean;
  error: Error | null;
  page: number;
  hasMore: boolean;
};

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Issue[]; hasMore: boolean }
  | { type: "FETCH_MORE_SUCCESS"; payload: Issue[]; hasMore: boolean }
  | { type: "FETCH_ERROR"; payload: Error }
  | { type: "LOAD_MORE" };

const initialState: State = {
  issues: [],
  loading: true,
  error: null,
  page: 1,
  hasMore: true,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...initialState, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        issues: action.payload,
        hasMore: action.hasMore,
        page: 1,
      };
    case "FETCH_MORE_SUCCESS":
      return {
        ...state,
        loading: false,
        issues: [...state.issues, ...action.payload],
        hasMore: action.hasMore,
      };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "LOAD_MORE":
      return { ...state, page: state.page + 1, loading: true };
    default:
      return state;
  }
}

export function useIssues(language: string, sort: "asc" | "desc") {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadMore = useCallback(() => {
    if (state.hasMore && !state.loading) {
      dispatch({ type: "LOAD_MORE" });
    }
  }, [state.hasMore, state.loading]);

  useEffect(() => {
    dispatch({ type: "FETCH_START" });
    fetchIssues({
      language,
      sortByStars: sort,
      perPage: 20,
      page: 1,
    })
      .then((data) => {
        const issues = data.items.map((item: any) => ({
          ...item,
          user: item.author,
        }));
        dispatch({
          type: "FETCH_SUCCESS",
          payload: issues,
          hasMore: data.items.length > 0,
        });
      })
      .catch((err) => {
        dispatch({ type: "FETCH_ERROR", payload: err });
      });
  }, [language, sort]);

  useEffect(() => {
    if (state.page > 1) {
      fetchIssues({
        language,
        sortByStars: sort,
        perPage: 20,
        page: state.page,
      })
        .then((data) => {
          const issues = data.items.map((item: any) => ({
            ...item,
            user: item.author,
          }));
          dispatch({
            type: "FETCH_MORE_SUCCESS",
            payload: issues,
            hasMore: data.items.length > 0,
          });
        })
        .catch((err) => {
          dispatch({ type: "FETCH_ERROR", payload: err });
        });
    }
  }, [state.page, language, sort]);

  return { ...state, loadMore };
}
