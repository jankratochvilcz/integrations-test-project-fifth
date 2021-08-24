import { capitalize } from './capitalize'
import { HandlebarsHelper } from './handlebarHelper'

export const responsibleRenderer: HandlebarsHelper = {
    name: 'responsibleRenderer',
    transform: (x: string) => capitalize.transform(!!x && x.length > 0 ? x : '*⚠ (No DRD)*'),
}
