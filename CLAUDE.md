# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ALS MSISDN Oracle Service

This is a Mojaloop Account Lookup Service (ALS) Oracle for MSISDN identifiers. The service provides participant lookup functionality for mobile subscriber identification numbers.

## Development Commands

### Build and Development
- `npm run build` - Full build including OpenAPI generation, TypeScript compilation, and file copying
- `npm run build:openapi` - Generate OpenAPI spec from yaml templates
- `npm run start` - Start the service (requires build first)
- `npm run start:dev` - Build and start with ts-node
- `npm run start:watch` - Start with file watching using nodemon

### Testing
- `npm run test` - Run both unit and integration tests
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests (requires database)
- `npm run test:int` - Alternative integration test command with jest
- `npm run test:coverage` - Run tests with coverage
- `npm run test:bdd` - Run BDD/Cucumber tests

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

### Database Operations
- `npm run migrate` - Run migrations and seeds
- `npm run migrate:latest` - Run database migrations
- `npm run seed:run` - Run database seeds

### Docker Development
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run Docker container
- `npm run docker:up` - Start services with docker-compose
- `docker-compose up -d mysql` - Start only MySQL for local development

## Architecture Overview

### Core Structure
- **Domain Layer** (`src/domain/`): Business logic and participant services
  - `ParticipantService.ts` - Core business operations
  - `ParticipantController.ts` - Request/response handling
  - `participants.ts` - Domain functions for CRUD operations

- **Server Layer** (`src/server/`): Hapi.js web server setup
  - Uses Hapi.js framework with OpenAPI/Swagger integration
  - Route handlers in `handlers/` directory with dynamic paths like `{Type}/{ID}`
  - Plugin architecture for OpenAPI, logging, and health checks

- **Model Layer** (`src/model/`): Data models and database interactions
  - `MSISDN/PartyMapItem.ts` - Core data model for party mapping
  - Database operations abstracted through `~/lib/db`

- **Shared Services** (`src/shared/`): Common utilities
  - Configuration management with Convict
  - Logger setup
  - DTO transformations

### Database Integration
- Uses Knex.js for database operations and migrations
- Supports MySQL (primary) and SQLite (testing)
- Database abstraction in `src/lib/db.ts`
- Migrations and seeds in respective directories

### API Design
- OpenAPI 3.0 specification built from YAML templates
- RESTful endpoints following Mojaloop conventions
- Participant management endpoints with pattern matching for types and IDs
- Health and metrics endpoints included

### Testing Strategy
- Unit tests: Individual component testing
- Integration tests: Database and API endpoint testing
- BDD tests: Feature-based testing with Cucumber
- Test data and fixtures in `test/data/` and `test/fixtures.ts`

## Key Development Notes

- Uses `module-alias` with `~` prefix pointing to `dist/src/`
- TypeScript with strict configuration
- ESLint with TypeScript support
- Node.js 22.17+ required
- Multi-stage Docker build for production