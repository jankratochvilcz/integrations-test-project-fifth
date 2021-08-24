# Integrations Team Automation (Doist Integrations Test Project)

*Welcome to Doist Integrations' test project!*

*It's a NestJS server app based on an internal API we use inside the team to automate some backlog-management and reporting tasks.*

*Your goal will be to implement a feature and fix a bug. Head to the **Issues tab** to find them*

*You should spend at maximum 8 hours on this project.*

*Good luck!*

----------

This repo houses the tooling that we use to automate the process within the Integrations Team. We expose the tooling as a NestJS API.

## Features

| Endpoint                   | Functionality                                                                                                                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/github/link-child-issue`      | Generates markdown tables to link parent and child Issues together using the `part of` syntax, analogous to GitHub's `closes`. |

## Quality

At this point the project doesn't meet all the [Best Practices](https://github.com/Doist/doist-documentation/blob/master/Engineering/Integrations/Integrations-Best-Practices.md) of the integrations as it's not customer-facing. This said, all new changes are expected to improve status quo. If we touch sub-par code and don't have time to improve it, we should create issues to track the technical debt

## Development

To test the integration, it's helpful to use [Ngrok](https://ngrok.com/). Once installed, use `ngrok http 3000` to start the tunnel. Note the URL as you will need it when configuring the GitHub webhook.

Next up, configure your GitHub webhook at https://github.com/{{ORGANIZATION}}/{{REPO}}/settings/hooks. Make sure you pick the JSON content type. Make sure you note the webhook token. You only care about the **Issues** events for now.

When you're done in GitHub, copy `.example.env` as `.env` (gitignored) and fill in your values. Once done, run the project using `npm install` and `npm run start`, you should be able to start the service.

It's helpful to test on a personal repo where you have full access and won't face permissions restrictions. Note that in GitHub, you can create hooks for an organization or a repo. For testing, webhooks into a specific repo are sufficient.

### Environment Variables

| Variable                             | Purpose                                                                                                                                            |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GITHUB_TOKEN`                       | The token we'll use to interact with GitHub Issues and Projects                                                                                    |
| `GITHUB_REQUEST_VERIFICATION_SECRET` | See [Securing your webhooks](https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events/securing-your-webhooks) in GitHub docs |
