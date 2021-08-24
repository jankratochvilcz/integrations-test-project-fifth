import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export type GitHubCreateCardForRepository = {
    repository: string
    requiredLabels?: string[]
}

export class GitHubConfiguration {
    constructor(readonly token: string, readonly gitHubRequestVerificationSecret: string) {}
}

@Injectable()
export class GitHubConfigurationService {
    constructor(private readonly configService: ConfigService) {}

    getConfiguration(): GitHubConfiguration {
        return {
            token: this.configService.get('GITHUB_TOKEN'),
            gitHubRequestVerificationSecret: this.configService.get(
                'GITHUB_REQUEST_VERIFICATION_SECRET',
            ),
        }
    }
}
