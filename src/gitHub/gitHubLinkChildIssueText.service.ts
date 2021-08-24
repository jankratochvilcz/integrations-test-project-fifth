import { Injectable } from '@nestjs/common'
import { drop, dropWhile, takeWhile } from 'lodash'
import { GitHubIssueState } from './gitHubIssue'

const CHILDREN_TABLE_HEADER = '|Child Issue|Responsible|Status|'
const CHILDREN_TABLE_HEADER_DIVIDER = '|-|-|-|'
const WARNING = '*This table is auto-generated it; do not put any content after it.*'

export type GitHubIssueText = {
    title: string
    url: string
    assigned: string
    state: GitHubIssueState
    nodeId?: string
}

function getLines(commentBody: string) {
    return commentBody?.split('\n') ?? []
}

@Injectable()
export class GitHubLinkChildIssueTextService {
    getExistingChildIssues(commentBody: string): GitHubIssueText[] {
        const lines = getLines(commentBody)
        const linesStartingWithHeader = dropWhile(lines, (x) => x !== CHILDREN_TABLE_HEADER)

        if (linesStartingWithHeader[1] !== CHILDREN_TABLE_HEADER_DIVIDER) {
            return []
        }

        const linesWithoutHeader = drop(lines, 2)
        const parsedLines = linesWithoutHeader.map((line) =>
            /^\|(<!--\s(?<nodeId>[^\s]+)\s-->)?\[(?<title>[^\]]+)\]\((?<url>[^)]+)\)\|(?<assigned>\w+)\|(?<state>\w+)\|$/gm.exec(
                line,
            ),
        )
        const issues = parsedLines
            .filter((match) => !!match?.groups)
            .map((match) => ({
                title: match.groups['title'],
                assigned: match.groups['assigned'],
                url: match.groups['url'],
                state: match.groups['state'] as GitHubIssueState,
                nodeId: match.groups['nodeId'],
            }))

        return issues
    }

    getChildIssuesTable(issues: GitHubIssueText[]): string {
        const headerLines = [CHILDREN_TABLE_HEADER, CHILDREN_TABLE_HEADER_DIVIDER]

        const issueLines = issues.map(
            ({ assigned, state, title, url, nodeId }) =>
                `|${nodeId ? `<!-- ${nodeId} -->` : ''}[${title}](${url})|${assigned}|${state}|`,
        )

        const allLines = [...headerLines, ...issueLines]

        const text = allLines.reduce((accumulate, current) => `${accumulate}\n${current}`, '')

        return text
    }

    addOrReplaceIssuesTable(commentBody: string, table: string): string {
        const lines = getLines(commentBody)
        const linesBeforeTableBody = takeWhile(lines, (x) => !x.includes(CHILDREN_TABLE_HEADER))
        const linesBeforeTableBodyTrimmed = linesBeforeTableBody

        const result =
            linesBeforeTableBodyTrimmed.length > 0
                ? `${linesBeforeTableBodyTrimmed.reduce(
                      (acc, curr) => acc + '\n' + curr,
                  )}\n${table}`
                : table

        return `${result}\n\n${WARNING}`
    }

    getTitle(title: string): string {
        const match = /^(?<title>[^📜]+)(?<tasks>\s📜\d+\/\d+)$/gmu.exec(title)

        return match?.groups['title'] ?? title
    }

    addIssueCount(title: string, completed: number, total: number): string {
        return total > 0 ? `${title.trimRight()} 📜${completed}/${total}` : title
    }
}
