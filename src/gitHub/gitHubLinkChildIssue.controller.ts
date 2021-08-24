import { Controller, Request, Headers, Post, HttpException } from '@nestjs/common'
import { Octokit } from '@octokit/rest'
import { createHmac } from 'crypto'
import { sortBy } from 'lodash'
import { GitHubAction } from './gitHubAction'
import { GitHubConfigurationService } from './gitHubConfiguration.service'
import { getAssignee, GitHubIssue, GitHubIssueState } from './gitHubIssue'
import {
    GitHubIssueText,
    GitHubLinkChildIssueTextService,
} from './gitHubLinkChildIssueText.service'

export const ENDPOINT_PATH = 'github/link-child-issue'
export const GITHUB_SIGNATURE_HEADER_KEY = 'x-hub-signature-256'

type GitHubLinkChildIssueRequest = {
    action: GitHubAction
    issue: GitHubIssue
}

function getChildIssueText(issue: GitHubIssue): GitHubIssueText {
    return {
        nodeId: issue.node_id,
        title: issue.title,
        url: issue.html_url,
        assigned: getAssignee(issue)?.login,
        state: issue.state,
    }
}

@Controller(ENDPOINT_PATH)
export class GitHubLinkChildIssueController {
    client: Octokit
    constructor(
        private readonly textService: GitHubLinkChildIssueTextService,
        private readonly configuration: GitHubConfigurationService,
    ) {
        this.client = new Octokit({
            auth: configuration.getConfiguration().token,
        })
    }

    async getIssue(owner: string, repo: string, issueNumber: number): Promise<GitHubIssue> {
        const { data } = await this.client.issues.get({
            issue_number: issueNumber,
            owner,
            repo,
        })

        return {
            ...data,
            assignee: data.assignee,
            severity: null,
            integration: null,
            created_at: null,
            state: data.state as GitHubIssueState,
        }
    }

    async updateIssue(
        body: string,
        issueNumber: number,
        owner: string,
        repo: string,
        title: string,
    ): Promise<boolean> {
        const { status } = await this.client.issues.update({
            title,
            body,
            issue_number: issueNumber,
            owner,
            repo,
        })

        return status === 200
    }

    @Post()
    async get(
        @Request() request: { body: Buffer },
        @Headers() headers: Record<string, string>,
    ): Promise<string> {
        const bodyAsString = request.body.toString()
        const secret = this.configuration.getConfiguration().gitHubRequestVerificationSecret
        const digest = createHmac('sha256', secret)
            .update(bodyAsString)
            .digest('hex')

        if (`sha256=${digest}` !== headers[GITHUB_SIGNATURE_HEADER_KEY]) {
            throw new HttpException('Digest does not match', 401)
        }

        const { issue, action } = JSON.parse(bodyAsString) as GitHubLinkChildIssueRequest

        if (!issue.body) {
            return 'No first comment found on issue.'
        }

        const parentReference = /((part\sof)|(child\sof))\s(https?:\/\/)?(api\.)?github\.com(\/repos)?\/(?<owner>[\w-]+)\/(?<repo>[\w-]+)\/?issues\/(?<issueNumber>\d+)/gm.exec(
            issue.body,
        )

        if (!parentReference?.groups) {
            return 'No parent reference found on first comment'
        }

        const parentOwner = parentReference.groups['owner'].toLowerCase()
        const parentRepo = parentReference.groups['repo'].toLowerCase()
        const parentIssueNumber = parseInt(parentReference.groups['issueNumber'].toLowerCase())

        const parentIssue = await this.getIssue(parentOwner, parentRepo, parentIssueNumber)

        if (!parentIssue) {
            return 'Parent comment has no body.'
        }

        const existingChildIssues = this.textService.getExistingChildIssues(parentIssue.body)
        const existingChildIssuesWithoutUpdated = existingChildIssues.filter(
            (x) => x.url !== issue.html_url && (!x.nodeId || x.nodeId !== issue.node_id),
        )

        const childIssueText: GitHubIssueText = getChildIssueText(issue)

        const existingChildIssuesWithUpdated =
            action === 'deleted' || action === 'transferred'
                ? existingChildIssuesWithoutUpdated
                : [...existingChildIssuesWithoutUpdated, childIssueText]

        const existingChildIssuesWithUpdatedSorted = sortBy(existingChildIssuesWithUpdated, [
            'state',
            'title',
        ])

        const updatedCommentBody = this.textService.addOrReplaceIssuesTable(
            parentIssue.body,
            this.textService.getChildIssuesTable(existingChildIssuesWithUpdatedSorted),
        )

        const updatedTitle = this.textService.addIssueCount(
            this.textService.getTitle(parentIssue.title),
            existingChildIssuesWithUpdated.filter((issue) => issue.state === 'closed').length,
            existingChildIssuesWithUpdatedSorted.length,
        )

        const updateCommentResult = await this.updateIssue(
            updatedCommentBody,
            parentIssue.number,
            parentOwner,
            parentRepo,
            updatedTitle,
        )

        return updateCommentResult ? 'Updated parent comment' : 'Update failed'
    }
}
