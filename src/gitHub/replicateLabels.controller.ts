import { Controller, Request, Headers, Post, HttpException, Param } from '@nestjs/common'
import { Octokit } from '@octokit/rest'
import { createHmac } from 'crypto'
import { GitHubAction } from './gitHubAction'
import { GitHubConfigurationService } from './gitHubConfiguration.service'
import { GitHubLabel } from './gitHubLabel'

export const ENDPOINT_PATH = 'github/replicate-labels'
export const GITHUB_SIGNATURE_HEADER_KEY = 'x-hub-signature-256'

type GitHubReplicateLabelsRequest = {
    action: GitHubAction
    label: GitHubLabel
    changes: {
        name: {
            from: string
        }
    }
}


@Controller(ENDPOINT_PATH)
export class ReplicateLabelsController {
    client: Octokit
    constructor(
        private readonly configuration: GitHubConfigurationService,
    ) {
        this.client = new Octokit({
            auth: configuration.getConfiguration().token,
        })
    }

    @Post()
    async get(
        @Request() request: { body: Buffer, query: { owner: string, repos: string } },
        @Headers() headers: Record<string, string>
    ): Promise<string> {
        const { body, query } = request
        const { owner, repos } = query
        const reposDeserialized = JSON.parse(repos)
        const bodyAsString = body.toString()
        const secret = this.configuration.getConfiguration().gitHubRequestVerificationSecret
        const digest = createHmac('sha256', secret)
            .update(bodyAsString)
            .digest('hex')

        if (`sha256=${digest}` !== headers[GITHUB_SIGNATURE_HEADER_KEY]) {
            throw new HttpException('Digest does not match', 401)
        }

        const { label, action, changes } = JSON.parse(bodyAsString) as GitHubReplicateLabelsRequest

        const hasLabel = async (repo: string, labelName: string): Promise<boolean> => {
            try {
                return !!(await this.client.issues.getLabel({
                    name: labelName,
                    repo,
                    owner,
                })).data
            } catch (error) {
                // no label
                return false
            }
        }

        if (action === 'deleted') {
            await Promise.all(reposDeserialized.map(async x => {
                if(!await hasLabel(x, label.name)) {
                    return;
                }

                await this.client.issues.deleteLabel({
                    repo: x,
                    name: label.name,
                    owner,
                })
            }))
        }

        else if (action === 'created') {
            await Promise.all(reposDeserialized.map(x => this.client.issues.createLabel({
                repo: x,
                name: label.name,
                owner,
                color: label.color
            })))
        }

        else if (action === 'edited') {
            await Promise.all(reposDeserialized.map(async x => {
                if (!await hasLabel(x, changes.name.from)) {
                    return;
                }
                
                await this.client.issues.updateLabel({
                    repo: x,
                    name: changes.name.from,
                    new_name: label.name,
                    owner,
                    color: label.color
                })
            }))
        }

        return 'Ok'
    }
}
