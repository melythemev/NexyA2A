# GitHub MCP Server

> **Deprecation Notice:**  
> Development for this project has been moved to [github/github-mcp-server](http://github.com/github/github-mcp-server).

---

## Overview

MCP Server for the GitHub API, enabling file operations, repository management, search functionality, and more.

---

## Architecture

```mermaid
flowchart TD
    User[User/Client] -->|API Request| MCPServer[MCP Server]
    MCPServer -->|GitHub API| GitHub[GitHub]
    MCPServer -->|File Ops| FileSystem[(File System)]
    MCPServer -->|Service: nexy-cron| NexyCron[nexy-cron Service]
    MCPServer -->|Service: SocialNexy| SocialNexy[SocialNexy Service]
```

---

## Features

- **Automatic Branch Creation**: Branches are created as needed.
- **Comprehensive Error Handling**: Clear error messages for common issues.
- **Git History Preservation**: Maintains proper Git history.
- **Batch Operations**: Supports single and multi-file operations.
- **Advanced Search**: Search code, issues/PRs, and users.

---

## Services

- **nexy-cron**: Token analytics, wallet stats, trending tokens, and more.
- **SocialNexy**: Social sentiment, trending topics, and influencer data.

---

## Tools

```mermaid
graph TD
    subgraph File & Repo
        create_or_update_file
        push_files
        get_file_contents
        create_repository
        fork_repository
        create_branch
        list_commits
    end
    subgraph Search
        search_repositories
        search_code
        search_issues
        search_users
    end
    subgraph Issues & PRs
        create_issue
        update_issue
        add_issue_comment
        create_pull_request
        get_pull_request
        list_pull_requests
        create_pull_request_review
        merge_pull_request
        get_pull_request_files
        get_pull_request_status
        get_pull_request_comments
        get_pull_request_reviews
        update_pull_request_branch
        get_issue
        list_issues
    end
```

- See the full list of tools and their parameters in the [Tools Section](#tools-section).

---

## Setup

### Personal Access Token

1. [Create a GitHub Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) with appropriate permissions.
2. Add it to your environment or configuration.

### Usage with Claude Desktop

#### Docker

```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "mcp/github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

#### NPX

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

---

## Build

```bash
docker build -t mcp/github -f src/github/Dockerfile .
```

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

## Diagrams

### High-Level Architecture

```mermaid
flowchart TD
    User[User/Client] -->|API Request| MCPServer[MCP Server]
    MCPServer -->|GitHub API| GitHub[GitHub]
    MCPServer -->|File Ops| FileSystem[(File System)]
    MCPServer -->|Service: nexy-cron| NexyCron[nexy-cron Service]
    MCPServer -->|Service: SocialNexy| SocialNexy[SocialNexy Service]
```

### Tools/Commands Overview

```mermaid
graph TD
    subgraph File & Repo
        create_or_update_file
        push_files
        get_file_contents
        create_repository
        fork_repository
        create_branch
        list_commits
    end
    subgraph Search
        search_repositories
        search_code
        search_issues
        search_users
    end
    subgraph Issues & PRs
        create_issue
        update_issue
        add_issue_comment
        create_pull_request
        get_pull_request
        list_pull_requests
        create_pull_request_review
        merge_pull_request
        get_pull_request_files
        get_pull_request_status
        get_pull_request_comments
        get_pull_request_reviews
        update_pull_request_branch
        get_issue
        list_issues
    end
```

---

*For more details, see the full documentation or codebase.*
