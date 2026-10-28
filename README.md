# Stash Proxy

Serverless API endpoints used by the [Stash](https://github.com/UrTechTips/stash) mobile application. The project is designed to be deployed as a [Vercel](https://vercel.com/) project, with each file in `api/` exposed as an HTTP endpoint.

## What it does

Stash Proxy currently provides:

- A health-check endpoint for confirming that the deployment is running.
- A protected endpoint that forwards user feedback to GitHub Issues.

Keeping these operations in a small serverless API avoids putting GitHub integration details in the mobile application.

## Requirements

- Node.js 18 or newer (the GitHub endpoint uses the built-in `fetch` API).
- A Vercel account for deployment.
- Access to the GitHub repository that will receive user feedback.

## Getting started

Clone the repository and install the project dependencies:

```bash
git clone https://github.com/UrTechTips/stash-proxy.git
cd stash-proxy
npm install
```

There are currently no runtime dependencies. The API handlers are intended to run in Vercel's serverless runtime rather than as a standalone Node.js server.

### Deploy with Vercel

1. Import this repository into Vercel, or install and authenticate with the Vercel CLI.
2. Create a new Vercel project using the repository root as the project directory.
3. Deploy the project.
4. Verify the deployment with the health-check request below.

```bash
curl https://<your-deployment>.vercel.app/api/ping
```

A successful response is:

```json
{
  "status": "success",
  "message": "Vercel serverless function is up and running!"
}
```

## API overview

### `GET /api/ping`

Returns `200 OK` when the serverless function is available. Other HTTP methods return `405 Method Not Allowed`.

### `POST /api/github-issue`

Accepts feedback from the Stash mobile application and creates a GitHub issue labeled `user-feedback`. Requests must include:

- The `x-app-identifier` header with the value `stash-mobile-v1`.
- A JSON body containing `title` and `body`.

Example request:

```bash
curl -X POST https://<your-deployment>.vercel.app/api/github-issue \
  -H "Content-Type: application/json" \
  -H "x-app-identifier: stash-mobile-v1" \
  -d '{"title":"Example feedback","body":"Feedback submitted from the Stash app."}'
```

The endpoint returns the created issue URL on success. Requests using another HTTP method or missing the required application identifier are rejected with `405` or `403`, respectively.

> **Deployment note:** Before using `/api/github-issue` in a deployment, configure its GitHub repository target and authentication securely in the serverless function. Never commit GitHub tokens or other secrets to the repository. Local environment files such as `.env.local` are ignored by Git.

## Project structure

```text
.
├── api/
│   ├── github-issue.js  # Creates GitHub issues from app feedback
│   └── ping.js          # Deployment health check
├── package.json
└── README.md
```

## Contributing

Contributions and bug reports are welcome:

1. Fork the repository and create a focused feature or fix branch.
2. Make the smallest change that addresses the issue.
3. Test the affected endpoint in a Vercel preview deployment.
4. Open a pull request describing the behavior change and how it was tested.

Please do not include credentials, tokens, or private user feedback in commits or pull requests.

## Support

- Report bugs or request changes in the [repository issue tracker](https://github.com/UrTechTips/stash-proxy/issues).
- For questions about the client application, see the [Stash repository](https://github.com/UrTechTips/stash).
- Pull requests are the preferred way to propose code changes.

## Maintainer

Maintained by [UrTechTips](https://github.com/UrTechTips).
