import { HandlebarsHelper } from './handlebarHelper'

export const dateFormatHelper: HandlebarsHelper = {
    name: 'dateFormat',
    transform: (x) => new Date(Date.parse(x)).toDateString(),
}
