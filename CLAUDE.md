# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

The ALS MSISDN Oracle Service is a Mojaloop component that provides MSISDN (Mobile Station International Subscriber Directory Number) lookup functionality within the Account Lookup Service (ALS) ecosystem. It stores and manages mappings between MSISDNs and participant identifiers.

## Key Architecture

### Service Structure
```
src/
├── cli.ts               # CLI entry point
├── server/             # HTTP server setup and handlers
│   ├── handlers/       # Route handlers
│   └── plugins/        # Hapi plugins (OpenAPI, metrics, health)
├── domain/             # Business logic layer
│   ├── participants.ts # Core participant operations
│   └── ParticipantService.ts # Service orchestration
├── model/              # Data models
│   └── MSISDN/        # MSISDN-specific models
├── lib/               # Infrastructure utilities
│   └── db.ts          # Database connection setup
└── shared/            # Shared utilities (config, logging)
```

### Key Dependencies
- **Hapi.js**: HTTP server framework
- **Knex.js**: SQL query builder for MySQL
- **TypeScript**: Primary language with strict type checking
- **Mojaloop libraries**: Error handling, health, metrics, shared components

## Development Commands

### Node.js Version
```bash
nvm use  # Always run this when entering the directory
```

### Building
```bash
npm run build           # Full build with OpenAPI spec generation
npm run build:openapi   # Generate OpenAPI spec only
npm run watch          # Watch mode for TypeScript compilation
```

### Running
```bash
npm start              # Run the compiled service
npm run start:dev      # Build and run in development
npm run start:watch    # Run with auto-restart on changes
```

### Testing
```bash
npm test                           # Run all tests (unit + integration)
npm run test:unit                  # Unit tests only
npm run test:integration           # Integration tests only
npm run test:coverage              # Tests with coverage report
npm run test:coverage-check        # Check coverage thresholds
npm run test:bdd                   # BDD feature tests

# Run a single test file
npm test -- test/unit/path/to/test.ts
```

### Code Quality
```bash
npm run lint           # ESLint check
npm run lint:fix       # Auto-fix linting issues
npm run audit:check    # Security vulnerability check
npm run audit:fix      # Fix vulnerabilities
npm run dep:check      # Check for outdated dependencies
npm run dep:update     # Update dependencies
```

### Database Operations
```bash
npm run migrate              # Run all migrations
npm run migrate:latest       # Run latest migrations
npm run migrate:rollback     # Rollback last migration
npm run seed:run            # Run database seeds
```

### Docker
```bash
npm run docker:build    # Build Docker image
npm run docker:up       # Start with docker-compose
npm run docker:down     # Stop and remove containers
npm run docker:clean    # Full cleanup including images
```

## Database Schema

The service uses a MySQL database with the following key table:
- `oracleMsisdn`: Stores MSISDN to participant mappings

## API Endpoints

### Health & Monitoring
- `GET /health` - Service health check
- `GET /metrics` - Prometheus metrics

### Participant Operations
- `POST /participants/{Type}/{ID}` - Create participant mapping
- `PUT /participants/{Type}/{ID}` - Update participant mapping
- `DELETE /participants/{Type}/{ID}/{SubId}` - Delete specific mapping
- `POST /participants` - Batch create participants

## Configuration

Configuration is managed through:
- Environment variables
- `config/default.json` for defaults
- Convict for validation and type safety

Key configuration areas:
- Database connection settings
- Server host/port
- Logging levels
- API documentation settings

## Testing Approach

- **Unit tests**: Fast, isolated tests using mocks
- **Integration tests**: Test with real database using Docker
- **Coverage**: Configured thresholds must be met
- **BDD tests**: Feature-based testing with Cucumber

## Local Development Setup

1. Ensure MySQL is running (use docker-compose):
   ```bash
   docker-compose up -d mysql
   ```

2. Run database migrations:
   ```bash
   npm run migrate
   ```

3. Start the service:
   ```bash
   npm run start:dev
   ```

4. Service available at: http://localhost:3000
   - API docs: http://localhost:3000/api/documentation
   - Health: http://localhost:3000/health