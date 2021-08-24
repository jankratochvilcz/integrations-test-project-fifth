import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export class AppConfiguration {
    constructor(readonly verificationToken: string) {}
}

@Injectable()
export class AppConfigurationService {
    constructor(private readonly configService: ConfigService) {}

    getConfiguration(): AppConfiguration {
        return {
            verificationToken: this.configService.get('VERIFICATION_TOKEN'),
        }
    }
}
