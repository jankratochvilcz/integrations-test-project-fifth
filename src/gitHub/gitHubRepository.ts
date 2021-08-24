export type GitHubRepository = {
    url: string
    id: number
}

export function getOwnerAndRepoNameFromUrl(url: string): { owner?: string; repo?: string } {
    // We want to match the following two patterns
    // 1. https://github.com/doist/todoist-google-assistant
    // 2. https://api.github.com/repos/doist/integrations-backlog
    // Conversely, we wan't to abvoid non-root paths like https://github.com/Doist/Todoist/blob/master/todoist/apps/alexa_skill
    const result = /^(https?:\/\/)?(api\.)?github\.com(\/repos)?\/(?<owner>[\w-]+)\/(?<repo>[\w-]+)\/?/gm.exec(
        url,
    )

    if (!result?.groups) {
        return {}
    }

    const owner = result.groups['owner'].toLowerCase()
    const repo = result.groups['repo'].toLowerCase()

    return {
        owner,
        repo,
    }
}

export function areSameRepository(repoAUrl: string, repoBUrl: string): boolean {
    const { owner: ownerA, repo: repoA } = getOwnerAndRepoNameFromUrl(repoAUrl.toLowerCase())
    const { owner: ownerB, repo: repoB } = getOwnerAndRepoNameFromUrl(repoBUrl.toLowerCase())

    return ownerA === ownerB && repoA === repoB
}
