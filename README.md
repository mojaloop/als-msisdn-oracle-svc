# ALS MSISDN Oracle (Work in Progress)

Code is based on the [Mojaloop ALS Consent Oracle] (https://github.com/mojaloop/als-consent-oracle)

## Overview

- [Documentation](./docs/README.md)

## Setup

### Clone repo
```bash
git clone git@github.com:mojaloop/als-msisdn-oracle-svc.git
```

### Improve local DNS resolver
Add the `127.0.0.1   als-msisdn-oracle-svc.local` entry in your `/etc/hosts` so the _als-msisdn-oracle-svc_ is reachable on `http://als-msisdn-oracle-svc.local:3000`. Elsewhere use `http://localhost:3000`

### Install service dependencies
```bash
cd als-msisdn-oracle-svc
npm ci
```

### Run local dockerized _als-msisdn-oracle-svc_
```bash
npm run docker:build
npm run docker:run
```

To check the als-msisdn-oracle-svc health visit [http://als-msisdn-oracle-svc.local:3000/health](http://als-msisdn-oracle-svc.local:3000/health)

### File structure of docker image
```
dist
│
└───config (Mount your default.json config file here)
└───migrations
└───seeds
└───src
└───package.json
logs
node_modules
package-lock.json
package.json (Run package commands with root package.json)
```

### Run locally with database in `docker-compose`

```bash
docker-compose up -d mysql
npm run migrate
npm run start
```


### Updating the OpenApi (Swagger) Spec

We use `multi-file-swagger` to make our swagger files more manageable.

After making changes to the `.yaml` files in `./src/interface/`, update the `swagger.json` file like so:

```bash
    npm run build:openapi
```

> Note: We will likely want to move to swagger 3.0 at some point, and once we do, we will be able to use the [common api snippets](https://github.com/mojaloop/api-snippets) library to factor out common Mojaloop snippets.
> Keep track of [#352 - Update to OpenAPI v3](https://app.zenhub.com/workspaces/pisp-5e8457b05580fb04a7fd4878/issues/mojaloop/mojaloop/352)

## Auditing Dependencies

We use `audit-ci` along with `npm audit` to check dependencies for node vulnerabilities, and keep track of resolved dependencies with an `audit-ci.jsonc` file.

To start a new resolution process, run:

```bash
npm run audit:fix
```

You can then check to see if the CI will pass based on the current dependencies with:

```bash
npm run audit:check
```

The [audit-ci.jsonc](./audit-ci.jsonc) contains any audit-exceptions that cannot be fixed to ensure that CircleCI will build correctly.


