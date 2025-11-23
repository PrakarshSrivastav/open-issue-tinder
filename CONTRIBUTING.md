# Contributing to OpenIssue Tinder

I welcome contributions to the OpenIssue Tinder project! Whether you're fixing bugs, adding new features, improving documentation, or optimizing performance, your help is greatly appreciated.

This document outlines the guidelines for contributing to this project.

## Getting Started

To get a local copy of the project up and running, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/open-issue-tinder.git # Replace with actual repo URL
    cd open-issue-tinder
    ```
2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    cp .env.example .env # Create your .env file
    # Edit .env and set GITHUB_TOKEN=YOUR_PERSONAL_ACCESS_TOKEN
    # The GITHUB_TOKEN needs appropriate permissions (e.g., public_repo scope for public repos).
    npm run db:seed # Seed the database with initial data
    npm run dev # Start the backend in development mode
    ```
    *   **Python Dependencies:** The backend relies on a Python script for GitHub merge stats. Ensure you have Python installed and install `PyGithub`:
        ```bash
        pip install PyGithub
        ```
3.  **Frontend Setup:**
    ```bash
    cd frontend/frontend # Navigate into the React project directory
    npm install
    npm run dev # Start the frontend in development mode
    ```

## Code Style

*   We use ESLint for code linting. Please ensure your code passes lint checks.
*   Follow the existing code style and conventions of the project.

## Running Tests

It's important to ensure your changes don't break existing functionality and that new features are covered by tests.

*   **Backend Tests:**
    ```bash
    cd backend
    npm test
    ```
*   **Frontend Tests:**
    ```bash
    cd frontend/frontend
    npm test
    ```

## Submitting Changes

1.  **Create a new branch:** For each new feature or bug fix, create a new branch from `main`:
    ```bash
    git checkout main
    git pull origin main
    git checkout -b feature/your-feature-name # or bugfix/your-bugfix-name
    ```
2.  **Make your changes:** Implement your feature or fix the bug.
3.  **Write tests:** Add appropriate unit, integration, or end-to-end tests for your changes.
4.  **Run tests:** Ensure all tests pass (`npm test` in both backend and frontend).
5.  **Run lint:** Ensure your code adheres to the style guide (`npm run lint` in relevant project directories).
6.  **Commit your changes:** Write clear, concise commit messages.
    ```bash
    git commit -m "feat: Add new feature" # or "fix: Fix bug in X"
    ```
7.  **Push your branch:**
    ```bash
    git push origin feature/your-feature-name
    ```
8.  **Open a Pull Request:** Go to the GitHub repository and open a new Pull Request. Provide a clear description of your changes, why they were made, and any relevant screenshots or steps to reproduce.

## Planned Features / Roadmap

We are looking for contributions on the following features:

*   **User Authentication:** Implement user login/registration.
*   **User Profiles:** Create user profiles to track activity.
*   **Containerization:** Dockerize the application for easier deployment.
*   **Advanced Filtering/Search:** Enhance issue filtering capabilities.
*   **Notifications:** Implement notifications for relevant activities.

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project, you agree to abide by its terms.
