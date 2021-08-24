import { HandlebarsHelper } from './handlebarHelper'

export const removeNewlines: HandlebarsHelper = {
    name: 'removeNewlines',
    transform: (x: string) => x.replace('\r\n', '').replace('\n', ''),
}
