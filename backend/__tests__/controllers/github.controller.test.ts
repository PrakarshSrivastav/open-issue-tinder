// backend/__tests__/controllers/github.controller.test.ts
import { Request, Response } from 'express';
import { getMergeStats } from '../../src/controllers/github.controller';
import * as GithubService from '../../src/services/github.service'; // Import the module

// Mock the entire GithubService module
jest.mock('../../src/services/github.service', () => ({
  ...jest.requireActual('../../src/services/github.service'), // Import and retain default behavior
  getMergeRateFromPython: jest.fn(), // Mock this specific function
}));

describe('github.controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson }); // status returns an object with json
    mockRequest = {
      params: { owner: 'testowner', repo: 'testrepo' },
    };
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return merge stats successfully', async () => {
    const mockStats = { rate: 0.75, mergedCount: 15, closedNotMergedCount: 5, totalPullsInPeriod: 20 };
    (GithubService.getMergeRateFromPython as jest.Mock).mockResolvedValue(mockStats);

    await getMergeStats(mockRequest as Request, mockResponse as Response);

    expect(GithubService.getMergeRateFromPython).toHaveBeenCalledWith('testowner', 'testrepo');
    expect(mockResponse.json).toHaveBeenCalledWith(mockStats);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should return 500 if service throws an error', async () => {
    const errorMessage = 'GitHub API error: Something went wrong';
    (GithubService.getMergeRateFromPython as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await getMergeStats(mockRequest as Request, mockResponse as Response);

    expect(GithubService.getMergeRateFromPython).toHaveBeenCalledWith('testowner', 'testrepo');
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});
