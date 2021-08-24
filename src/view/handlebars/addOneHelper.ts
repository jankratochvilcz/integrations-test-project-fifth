import { HandlebarsHelper } from './handlebarHelper'

export const addOneHelper: HandlebarsHelper = {
    name: 'addOne',
    transform: (x) => (parseInt(x) + 1).toString(),
}
