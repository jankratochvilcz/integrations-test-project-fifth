type IntegrationsMemberName =
    | 'christoph'
    | 'david'
    | 'jan'
    | 'janusz'
    | 'lefteris'
    | 'scott'
    | 'willian'

type IntegrationsMember = {
    gitHubLogin: string
    name: IntegrationsMemberName
}

type IntegrationsSquad = {
    triageColumnId: number
    members: IntegrationsMemberName[]
}

export type IntegrationsTeam = {
    drds: IntegrationsProperty[]
    members: IntegrationsMember[]
    squads: IntegrationsSquad[]
    head: IntegrationsMemberName
    projectManagementRepo: string
    teamLabel: string
}

export type IntegrationsProperty = {
    category: 'dx-external' | 'dx-internal' | 'growing' | 'mature'
    description?: string
    'issue-label'?: string
    links?: IntegrationsPropertyLink[]
    name: string
    product: 'todoist' | 'twist' | 'doist'
    responsible?: IntegrationsMemberName
    'sentry-slugs'?: string[]
}

type IntegrationsPropertyLink = {
    kind?: 'misc' | 'repo' | 'spec' | 'twist-comms'
    url: string
}
