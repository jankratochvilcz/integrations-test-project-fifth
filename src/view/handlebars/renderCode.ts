import { HandlebarsHelper } from './handlebarHelper'

export const renderCode: HandlebarsHelper = {
    name: 'renderCode',
    transform: (x: string) => (!!x && x.length > 0 ? `\`${x}\`` : ''),
}
