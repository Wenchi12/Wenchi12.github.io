# useLocalStorage Hook

**Stack:** TypeScript, Jest, Rollup

A reusable React hook for localStorage persistence with SSR-safe handling.

Key highlights:
- Avoids hydration mismatches in server-rendered apps
- Clean API surface for persistence logic
- Includes testing and package documentation work

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

- `key`: The localStorage key to store the value under
- `initialValue`: The initial value to use if no stored value exists
- Returns: `[storedValue, setValue]` where `setValue` can accept a new value or an updater function

## Features

- **SSR Safe**: Works correctly in server-rendered environments
- **TypeScript Support**: Full type safety
- **Error Handling**: Gracefully handles localStorage errors
- **Functional Updates**: Supports updater functions like React's `useState`
