# useLocalStorage Hook

**Stack:** TypeScript, Jest, Rollup

A reusable React hook for localStorage persistence with SSR-safe handling and a clean TypeScript API.

## Features

- SSR-safe browser access guard
- JSON persistence for primitive and object values
- Functional update support mirroring `useState`
- Graceful error handling for read/write failures
- Packaged for distribution with Rollup and tests

## Installation

```bash
npm install use-local-storage-hook
```

## Usage

```tsx
import { useLocalStorage } from 'use-local-storage-hook';

function MyComponent() {
  const [name, setName] = useLocalStorage('name', 'John');

  return (
    <div>
      <p>Hello, {name}!</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}
```

## API

```typescript
useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void]
```

- `key`: The localStorage key used for persistence
- `initialValue`: Value returned when no stored entry exists
- Returns: `[value, setValue]`

## Local setup

```bash
cd use-local-storage-hook
npm install
npm test
npm run build
```

## Folder structure

- `src/useLocalStorage.ts` — hook implementation
- `src/index.ts` — package exports
- `tests/useLocalStorage.test.ts` — Jest-based behavior tests
- `rollup.config.js` — build configuration
- `tsconfig.json` — TypeScript settings

