# Stencil + NextJs Starter

A minimal reproduction monorepo for testing Stencil components with React output target within a Next.js application.

## Versions

- `@stencil/core`: latest
- `@stencil/react-output-target`: latest
- `react`: `^19.0.0`
- `next`: `^15.0.0` (using app router)

## Setup

```bash
# Install dependencies
pnpm install

# Start development mode (builds stencil first, then watches all)
pnpm start
```

The development server will start at http://localhost:3000/
In watch mode all changes to the Stencil components will automatically rebuild the React wrappers and reload the Next.js app.