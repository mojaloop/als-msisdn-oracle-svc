# Arguments
ARG NODE_VERSION=lts-alpine

# NOTE: Ensure you set NODE_VERSION Build Argument as follows...
#
#  export NODE_VERSION="$(cat .nvmrc)-alpine" \
#  docker build \
#    --build-arg NODE_VERSION=$NODE_VERSION \
#    -t mojaloop/sdk-scheme-adapter:local \
#    . \
#

# Build Image
FROM node:${NODE_VERSION} as builder
USER root

WORKDIR /opt/app/

RUN apk add --no-cache -t build-dependencies git make gcc g++ python3 libtool autoconf automake \
    && cd $(npm root -g)/npm

COPY package.json package-lock.json* /opt/app/
RUN npm ci

# Check in .dockerignore what is skipped during copy
COPY /. /opt/app/

RUN npm run build

# Cleanup
RUN apk del build-dependencies

FROM node:${NODE_VERSION}
WORKDIR /opt/app/

# Create empty log file & link stdout to the application log file
RUN mkdir ./logs && touch ./logs/combined.log
RUN ln -sf /dev/stdout ./logs/combined.log

# Create a non-root user: app-user
RUN adduser -D app-user
USER app-user

# Copy only essential files for running service
COPY --chown=app-user --from=builder /opt/app/node_modules ./node_modules
COPY --chown=app-user --from=builder /opt/app/package*.json ./
COPY --chown=app-user --from=builder /opt/app/dist ./dist

RUN npm prune --production

EXPOSE 3000
CMD ["npm", "run", "start"]
