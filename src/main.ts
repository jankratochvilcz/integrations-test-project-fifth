import { NestFactory } from '@nestjs/core'
import { init, captureException } from '@sentry/node'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { handlebars } from 'hbs'
import { helpers } from './view/handlebars'

import { AppModule } from './app.module'

async function bootstrap() {
    init({
        dsn: process.env.SENTRY_DSN,
    })

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bodyParser: false,
    })

    app.setBaseViewsDir(join(__dirname, '..', 'views'))
    app.setViewEngine('hbs')

    helpers.forEach(({ name, transform }) => {
        handlebars.registerHelper(name, transform)
    })

    await app.listen(process.env.PORT || 3000)
}

bootstrap().then(
    () => {
        // Server peacefully shut down
    },
    (exception) => {
        captureException(exception)
    },
)
