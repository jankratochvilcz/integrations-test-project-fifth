import { HandlebarsHelper } from './handlebarHelper'

export const capitalize: HandlebarsHelper = {
    name: 'capitalize',
    transform: (x: string) => x.replace(/^\w/, (c) => c.toUpperCase()),
}
