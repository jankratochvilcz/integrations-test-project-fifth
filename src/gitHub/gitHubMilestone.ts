export type GitHubMilestone = {
    id: number
    title: string
    url: string
    description: string
    state: 'open' | 'closed'
    due_on: string
    number: number
}
