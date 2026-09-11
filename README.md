# Simple Back — YouTube Retrieval API

> Simple YouTube search and download backend API.

WARNING: This project is in early development and may be insecure. Do not run it exposed to the public internet without reviewing the code and securing the host. See the Security section below.

Table of contents

- [About](#about)
- [Features](#features)
- [Quickstart](#quickstart)
- [Development](#development)
- [API](#api)
- [Configuration](#configuration)
- [Build & Scripts](#build--scripts)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## About

This repository contains a small backend service that provides two main capabilities:

- Search for music/videos using ytmusic-api
- Download video/audio using youtube-dl-exec

The service is implemented with Fastify (TypeScript) and is intended to be used as a helper backend for a client application.

## Features

- Fastify-based HTTP API
- /health endpoint for service health checks
- /find endpoint to search for music by query
- /download endpoint to download a video by videoId
- Uses ytmusic-api and youtube-dl-exec for search and download

## Quickstart

Prerequisites

- Node.js (recommended: Node 22+)
- npm

Install dependencies

```bash
npm install
```

Build and run (development)

```bash
npm run build
npm run bundle
npm run build:backend
npm run run:backend
```

The backend listens by default on 127.0.0.1:3000 and is configured to allow requests from the XPUI Spotify origin by default.

## Development

There are scripts defined in package.json for building frontend/Spicetify assets and bundling the Node backend binary. See [Build & Scripts](#build--scripts) for the available commands.

## API

All responses are JSON. The following endpoints exist in the codebase:

- GET /health
  - Description: Check service health and dependency status
  - Success: 200
  - Failure: 503 when dependencies are not ready

- GET /find?query=<string>
  - Description: Search for music/video results matching the query
  - Query params:
    - query (string) — required
  - Responses:
    - 200 — search results (proxy of ytmusic-api result)
    - 400 — bad request (missing or invalid query)
    - 502 — upstream search failed

- POST /download
  - Description: Download a video/audio by id
  - Body (JSON): { "videoId": "<video id>" }
  - Responses:
    - 200 — { ok: true, result }
    - 400 — bad request (missing or invalid videoId)
    - 502 — download failed

Examples

Search

```bash
curl "http://127.0.0.1:3000/find?query=lofi+hip+hop"
```

Download

```bash
curl -X POST "http://127.0.0.1:3000/download" -H "Content-Type: application/json" -d '{"videoId":"VIDEO_ID_HERE"}'
```

## Configuration

There are few hard-coded defaults in the current code:

- Server host: 127.0.0.1
- Server port: 3000
- Allowed CORS origin: https://xpui.app.spotify.com

If you need to change these, edit the server start/register options in src/helper_backend/index.mts.

## Build & Scripts

Relevant scripts from package.json

- npm run build — runs spicetify-creator (project includes Spicetify-related frontend tooling)
- npm run bundle — uses esbuild to bundle src/helper_backend/index.mts for Node
- npm run build:backend — packages the bundled backend into native executables using @yao-pkg/pkg
- npm run run:backend — runs the packaged binary
- npm run start — runs the full flow used by the project (builds frontend and backend and runs them)

See package.json for the full list of scripts and their exact commands.

## Security

This project includes code that downloads content from YouTube and spawns native processes (youtube-dl). Running this service as-is on a public-facing server is potentially dangerous. Security considerations:

- Validate and sanitize all inputs. The current code does some basic validation but review thoroughly.
- Restrict network access (bind to localhost, firewall, or run behind a reverse proxy with authentication).
- Keep dependencies up to date and audit the supply chain (npm audit / third-party binaries).
- Do not run untrusted downloaded files without inspection.

If you plan to deploy this service, add authentication, rate limiting, logging/monitoring, and containerize with resource limits.

## Contributing

Contributions are welcome. Please open an issue to discuss larger changes. For small fixes, open a pull request with a clear description and tests where applicable.

## License

This repository is licensed under the MIT License. See LICENSE for details.

## Acknowledgements

- Built with Fastify, ytmusic-api and youtube-dl-exec
- Spicetify-related frontend tooling is included in this repository
