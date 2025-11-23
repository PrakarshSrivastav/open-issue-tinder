// frontend/frontend/src/components/__tests__/IssueCard.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import IssueCard from '../IssueCard';
import * as api from '../../api';
import { Issue } from '../../types'; // Assuming Issue type is defined here or accessible

// Mock the API module
jest.mock('../../api', () => ({
  getMergeStats: jest.fn(),
}));

// Mock the react-icons to avoid SVG rendering issues in tests
jest.mock('react-icons/vsc', () => ({
    VscCircleFilled: () => <svg data-testid="VscCircleFilled" />,
    VscIssues: () => <svg data-testid="VscIssues" />,
    VscPerson: () => <svg data-testid="VscPerson" />,
    VscStarFull: () => <svg data-testid="VscStarFull" />,
}));


describe('IssueCard', () => {
  const mockIssue: Issue = {
    id: 123,
    number: 1,
    title: 'Test Issue',
    htmlUrl: 'https://github.com/testowner/testrepo/issues/1',
    state: 'open',
    comments: 5,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-02T10:00:00Z',
    labels: ['bug', 'easy'],
    author: { login: 'testuser', htmlUrl: 'https://github.com/testuser' },
    repo: {
      id: 456,
      fullName: 'testowner/testrepo',
      htmlUrl: 'https://github.com/testowner/testrepo',
      language: 'TypeScript',
      stars: 100,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders issue details correctly', () => {
    render(<IssueCard issue={mockIssue} />);

    expect(screen.getByText('Test Issue')).toBeInTheDocument();
    expect(screen.getByText('testowner/testrepo')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument(); // Stars
    expect(screen.getByText('TypeScript')).toBeInTheDocument(); // Language
    expect(screen.getByText('5')).toBeInTheDocument(); // Comments
    expect(screen.getByText('easy')).toBeInTheDocument(); // Difficulty
    expect(screen.getByText('@testuser')).toBeInTheDocument(); // Author
    expect(screen.getByRole('link', { name: /View on GitHub/i })).toHaveAttribute('href', mockIssue.htmlUrl);
  });

  it('shows the "Show 90-day Merge Rate" button initially', () => {
    render(<IssueCard issue={mockIssue} />);
    expect(screen.getByRole('button', { name: /Show 90-day Merge Rate/i })).toBeInTheDocument();
  });

  it('fetches and displays merge stats when button is clicked', async () => {
    const mockMergeStats = {
      rate: 0.8,
      mergedCount: 8,
      closedNotMergedCount: 2,
      totalPullsInPeriod: 10,
    };
    (api.getMergeStats as jest.Mock).mockResolvedValue(mockMergeStats);

    render(<IssueCard issue={mockIssue} />);
    const showMergeRateButton = screen.getByRole('button', { name: /Show 90-day Merge Rate/i });
    fireEvent.click(showMergeRateButton);

    expect(showMergeRateButton).toHaveTextContent('Loading...'); // Button text changes to Loading

    await waitFor(() => {
      expect(api.getMergeStats).toHaveBeenCalledTimes(1);
      expect(api.getMergeStats).toHaveBeenCalledWith('testowner', 'testrepo');
      expect(screen.getByText(/Acceptance Rate: 80.00%/i)).toBeInTheDocument();
      expect(screen.getByText(/\(8 merged \/ 10 closed PRs from last 90 days\)/i)).toBeInTheDocument();
      expect(showMergeRateButton).not.toBeInTheDocument(); // Button should be gone after stats are displayed
    });
  });

  it('displays error message if fetching merge stats fails', async () => {
    const errorMessage = 'Failed to fetch merge stats';
    (api.getMergeStats as jest.Mock).mockRejectedValue(new Error(errorMessage));

    render(<IssueCard issue={mockIssue} />);
    const showMergeRateButton = screen.getByRole('button', { name: /Show 90-day Merge Rate/i });
    fireEvent.click(showMergeRateButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(showMergeRateButton).not.toBeInTheDocument(); // Button should still be gone
    });
  });

  it('resets merge stats state when issue prop changes', async () => {
    const mockMergeStats1 = { rate: 0.8, mergedCount: 8, closedNotMergedCount: 2, totalPullsInPeriod: 10 };
    (api.getMergeStats as jest.Mock).mockResolvedValue(mockMergeStats1);

    const { rerender } = render(<IssueCard issue={mockIssue} />);

    // Click button to fetch stats for the first issue
    fireEvent.click(screen.getByRole('button', { name: /Show 90-day Merge Rate/i }));
    await waitFor(() => expect(screen.getByText(/Acceptance Rate: 80.00%/i)).toBeInTheDocument());

    const newMockIssue: Issue = {
        ...mockIssue,
        id: 456, // Different ID
        title: 'New Test Issue',
        repo: { ...mockIssue.repo, fullName: 'newowner/newrepo' }, // Different repo
    };

    // Rerender with a new issue
    rerender(<IssueCard issue={newMockIssue} />);

    // Expect the merge stats to be reset and button to reappear
    expect(screen.queryByText(/Acceptance Rate/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Show 90-day Merge Rate/i })).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByText('Failed to fetch merge stats')).not.toBeInTheDocument();
  });
});
