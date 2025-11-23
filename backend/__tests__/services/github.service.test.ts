// backend/__tests__/services/github.service.test.ts
import { getMergeRateFromPython } from '../../src/services/github.service';
import { spawn } from 'child_process';
import path from 'path';

// Mock child_process.spawn
jest.mock('child_process', () => ({
  spawn: jest.fn(),
}));

// Mock process.cwd() for consistent script path resolution
const mockCwd = '/mock/project/root';
Object.defineProperty(process, 'cwd', {
  value: () => mockCwd,
  writable: true,
});

describe('github.service - getMergeRateFromPython', () => {
  const mockOwner = 'testowner';
  const mockRepo = 'testrepo';
  const scriptPath = path.join(mockCwd, 'src', 'scripts', 'calculate_merge_rate.py');

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementation for spawn
    (spawn as jest.Mock).mockReturnValue({
      stdout: {
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback(JSON.stringify({ rate: 0.8, mergedCount: 20, closedNotMergedCount: 5, totalPullsInPeriod: 25 }));
          }
        }),
      },
      stderr: {
        on: jest.fn(),
      },
      on: jest.fn((event, callback) => {
        if (event === 'close') {
          callback(0); // Exit code 0 for success
        }
      }),
    });
  });

  it('should call the python script with correct arguments and return stats', async () => {
    const stats = await getMergeRateFromPython(mockOwner, mockRepo);

    expect(spawn).toHaveBeenCalledWith('python', [scriptPath, mockOwner, mockRepo]);
    expect(stats).toEqual({ rate: 0.8, mergedCount: 20, closedNotMergedCount: 5, totalPullsInPeriod: 25 });
  });

  it('should throw an error if python script exits with non-zero code', async () => {
    (spawn as jest.Mock).mockReturnValue({
      stdout: { on: jest.fn() },
      stderr: { on: jest.fn((event, callback) => { if (event === 'data') callback('Python script failed\n'); }) },
      on: jest.fn((event, callback) => {
        if (event === 'close') {
          callback(1); // Non-zero exit code
        }
      }),
    });

    await expect(getMergeRateFromPython(mockOwner, mockRepo)).rejects.toThrow('Python script stderr: Python script failed\n');
  });

  it('should throw an error if python script returns an error in JSON output', async () => {
    (spawn as jest.Mock).mockReturnValue({
      stdout: {
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback(JSON.stringify({ error: 'GitHub API token not set.' }));
          }
        }),
      },
      stderr: { on: jest.fn() },
      on: jest.fn((event, callback) => {
        if (event === 'close') {
          callback(0);
        }
      }),
    });

    await expect(getMergeRateFromPython(mockOwner, mockRepo)).rejects.toThrow('GitHub API token not set.');
  });

  it('should throw an error if python script output is not valid JSON', async () => {
    (spawn as jest.Mock).mockReturnValue({
      stdout: {
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback('This is not JSON');
          }
        }),
      },
      stderr: { on: jest.fn() },
      on: jest.fn((event, callback) => {
        if (event === 'close') {
          callback(0);
        }
      }),
    });

    await expect(getMergeRateFromPython(mockOwner, mockRepo)).rejects.toThrow('Failed to parse python script output: This is not JSON');
  });
});
