import { GitHubLabel } from './gitHubLabel'

export type GitHubIssueState = 'open' | 'closed' | 'all'

type GitHubUser = {
    login: string
}

export type GitHubIssue = {
    id: number
    number: number
    title: string
    url: string
    integration: string
    user: GitHubUser
    assignee: GitHubUser
    assignees: GitHubUser[]
    severity: string
    created_at: Date
    repository_url: string
    labels: GitHubLabel[]
    state: GitHubIssueState
    body: string
    html_url: string
    node_id: string
}

export function getAssignee(issue: GitHubIssue): GitHubUser | undefined {
    const { assignee, assignees } = issue

    return assignee ?? (!!assignees && assignees.length > 0) ? assignees[0] : undefined
}
