import { HandlebarsHelper } from './handlebarHelper'
import { removeNewlines } from './removeNewlines'
import { dateFormatHelper } from './dateFormatHelper'
import { addOneHelper } from './addOneHelper'
import { renderCode } from './renderCode'
import { responsibleRenderer } from './responsibleRenderer'
import { capitalize } from './capitalize'

export const helpers: HandlebarsHelper[] = [
    removeNewlines,
    dateFormatHelper,
    addOneHelper,
    renderCode,
    responsibleRenderer,
    capitalize,
]
