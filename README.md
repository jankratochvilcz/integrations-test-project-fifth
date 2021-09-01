# Integrations Team Automation (Doist Integrations Test Project)

*Welcome to Doist Integrations' test project!*

*It's a NestJS server app based on an internal API we use inside the team to automate some backlog management and reporting tasks.*

*Your goal will be to implement a feature and fix a bug. Head to the **Issues tab** to find them*

*You should spend a maximum of 8 hours on this project.*

*Good luck!*

----------

This repository hosts the code for the internal project management tooling of the integrations team. Doist uses GitHub for project management, but the out-of-box experience becomes insufficient for our needs as we grow. For that reason, we're extending GitHub in a few ways, via webhooks, to add additional features.

The general flow of individual endpoints is:
1. An endpoint is called by GitHub when a specific event (i.e., new issue) happens
2. The endpoint processes the event. If the event is relevant for the endpoint, it acts on it, usually in the form of altering related data in GitHub via the [Octokit SDK](https://github.com/octokit/octokit.js)

Each endpoint is in a separate controller. When you start the service with `npm run start`, all the endpoints become ready for accepting requests.

## Endpoints

### 1. `/github/link-child-issue`

The `/github/link-child-issue` endpoint helps us simulate parent/child relationships between GitHub Issues. When a user enters a `part of {{LINK TO ANOTHER ISSUE}}` snippet into an Issue, GitHub will call our endpoint. That endpoint will follow the URL to the linked issue and append the issue into a markdown table that enumerates all the child issues that are a part of the parent one. If such a table does not exist, it will generate it from scratch.

Aside from adding the markdown table, the endpoint also alters the parent issue's title to contain a count of linked issues. You can see both in the screenshot below.

![screenshot](https://p-NBF5xJ28.t3.n0.cdn.getcloudapp.com/items/2Nulq7qB/0e966b93-a83f-45c5-960c-2559ab166dea.jpeg?v=0bda7154be85f18627a165a230bfc31a)

## Quality

At this point, the project doesn't meet all the best practices of Integrations as it's not customer-facing. This said, all new changes are expected to improve the status quo. If we touch sub-par code and don't have time to improve it, we should create issues to track the technical debt

## Development

To test the integration, it's helpful to use [Ngrok](https://ngrok.com/). Once installed, use `ngrok http 3000` to start the tunnel. Note the URL as you will need it when configuring the GitHub webhook.

Next up, configure your GitHub webhook at https://github.com/{{ORGANIZATION}}/{{REPO}}/settings/hooks. Make sure you pick the JSON content type. Type in an arbitrary webhook secret and take note of it; you will need it later. You only care about the **Issues** events for now.

When you're done in GitHub, copy `.example.env` as `.env` (gitignored) and fill in your values. Once done, run the project using `npm install` and `npm run start`, you should be able to start the service.

It's helpful to test on a personal repo where you have full access and won't face permissions restrictions. Note that in GitHub, you can create hooks for an organization or a repo. For testing, webhooks into a specific repo are sufficient.

### Environment Variables

| Variable                             | Purpose                                                                                                                                            |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GITHUB_TOKEN`                       | The token we'll use to interact with GitHub Issues and Projects. More information on how to obtain the token [here](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token).     |
| `GITHUB_REQUEST_VERIFICATION_SECRET` | See [Securing your webhooks](https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events/securing-your-webhooks) in GitHub docs |
