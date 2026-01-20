# Stencil Starter Next

A minimal reproduction monorepo for testing Stencil components with Next.js output targets.

## Structure

```
packages/
├── stencil-lib        # Stencil web components (with hydrate output for SSR)
├── stencil-lib-react  # React wrapper bindings (client + server exports)
└── next-app           # Demo Next.js 15 application
```

## Requirements

- Node.js >= 22.0.0
- pnpm 9.15.0

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development (builds libs then starts Next.js dev server)
pnpm start

# Production build
pnpm build
```

## Development

The `pnpm start` command will:

1. Build the Stencil component library (including hydrate scripts for SSR)
2. Build the React wrapper library
3. Start the Next.js dev server

The Next.js app will be available at http://localhost:3000

## Packages

### @example/stencil-lib

The core Stencil component library with:
- `dist/` - Standard distribution
- `loader/` - Custom element loader
- `hydrate/` - Hydrate scripts for SSR

### @example/stencil-lib-react

React bindings with two export paths:
- `@example/stencil-lib-react` - Client-side components
- `@example/stencil-lib-react/next` - Server/client components for Next.js

### next-app

A demo Next.js 15 application using the App Router that demonstrates:
- Server-side rendering with Stencil components
- Client-side hydration with declarative shadow DOM
- Event handling in client components
