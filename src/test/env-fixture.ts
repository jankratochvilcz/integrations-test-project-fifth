export function setupEnvDefaults(): void {
    process.env.GITHUB_CREATE_CARD_CONFIG = '[]'
    process.env.GITHUB_MILESTONES_TARGET_REPOSITORIES = '[]'
    process.env.GITHUB_MILESTONES_SOURCE_REPOSITORY = '/doist/twist-giphy'
    process.env.GITHUB_REQUEST_VERIFICATION_SECRET =
        'nAk6vtc%SgG6Kkj8Ctzba62@n4uTYY8zFJC6n#8t%c@ET!D'
    process.env.INTEGRATIONS_TEAM =
        '{ "$schema": "./Integrations.schema.json", "members": [], "drds": [] }'
}
