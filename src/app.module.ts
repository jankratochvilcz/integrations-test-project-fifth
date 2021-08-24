import { Module } from '@nestjs/common'
import { GitHubReportModule } from './gitHub/gitHub.module'

@Module({
    imports: [GitHubReportModule],
})
export class AppModule {}
