import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GitHubConfigurationService } from './gitHubConfiguration.service'
import { JsonBodyMiddleware } from '../json-body.middleware'
import { RawBodyMiddleware } from '../raw-body.middleware'
import { AppConfigurationService } from '../appConfiguration.service'
import {
    GitHubLinkChildIssueController,
    ENDPOINT_PATH as LinkChildIssuePath,
} from './gitHubLinkChildIssue.controller'
import { GitHubLinkChildIssueTextService } from './gitHubLinkChildIssueText.service'
import { ReplicateLabelsController, ENDPOINT_PATH as ReplicateLabelsPath, } from './replicateLabels.controller'

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [GitHubLinkChildIssueController, ReplicateLabelsController],
    providers: [
        GitHubConfigurationService,
        AppConfigurationService,
        GitHubLinkChildIssueTextService,
    ],
})
export class GitHubReportModule {
    public configure(consumer: MiddlewareConsumer): void {
        // For the github webhooks, we want to verify that the triggers are legit and come from GitHub
        // See https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events/securing-your-webhooks for more details
        // This makes it necessary to have access to the raw HTTP Body so that we can hash it.
        // The solution is copied from https://stackoverflow.com/a/56745880
        consumer
            .apply(RawBodyMiddleware)
            .forRoutes({
                path: `/${LinkChildIssuePath}`,
                method: RequestMethod.ALL,
            })
            .apply(RawBodyMiddleware)
            .forRoutes({
                path: `/${ReplicateLabelsPath}`,
                method: RequestMethod.ALL,
            })
            .apply(JsonBodyMiddleware)
            .forRoutes('github/*')
    }
}
