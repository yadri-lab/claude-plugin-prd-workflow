---
name: testing
description: Test creation, execution, and coverage analysis
category: Quality Assurance
---

# Testing Skill

Provides expertise in test-driven development, test automation, and achieving comprehensive test coverage across unit, integration, and end-to-end testing.

## Testing Philosophy

**Testing Pyramid**:
```
       /\
      /  \   E2E Tests (Few)
     /----\
    / Inte \  Integration Tests (Some)
   /  gration\
  /----------\
 / Unit Tests \ (Many)
/--------------\
```

**70% Unit | 20% Integration | 10% E2E**

## 1. Unit Testing

### React Component Tests (Vitest + Testing Library)

**Button Component Test**:
```typescript
// Button.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant className', () => {
    const { container } = render(<Button variant="secondary">Test</Button>);
    expect(container.firstChild).toHaveClass('bg-gray-200');
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Test</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading spinner when loading', () => {
    render(<Button loading>Test</Button>);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('supports different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-8');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-12');
  });
});
```

### Hook Tests

**useLocalStorage Hook Test**:
```typescript
// useLocalStorage.test.ts

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', ''));

    act(() => {
      result.current[1]('new value');
    });

    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new value'));
    expect(result.current[0]).toBe('new value');
  });

  it('syncs across tabs', () => {
    const { result: result1 } = renderHook(() => useLocalStorage('test-key', ''));
    const { result: result2 } = renderHook(() => useLocalStorage('test-key', ''));

    act(() => {
      result1.current[1]('shared value');
    });

    // Simulate storage event from another tab
    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'test-key',
          newValue: JSON.stringify('shared value'),
        })
      );
    });

    expect(result2.current[0]).toBe('shared value');
  });
});
```

---

## 2. Integration Testing

### API Integration Test

**User Service Test**:
```typescript
// userService.test.ts

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { UserService } from './userService';

const server = setupServer(
  rest.get('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.json({
        id,
        name: 'John Doe',
        email: 'john@example.com',
      })
    );
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('UserService', () => {
  it('fetches user by ID', async () => {
    const user = await UserService.getById('123');

    expect(user).toEqual({
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
    });
  });

  it('handles 404 error', async () => {
    server.use(
      rest.get('/api/users/:id', (req, res, ctx) => {
        return res(ctx.status(404));
      })
    );

    await expect(UserService.getById('999')).rejects.toThrow('User not found');
  });

  it('retries on network error', async () => {
    let attempts = 0;

    server.use(
      rest.get('/api/users/:id', (req, res, ctx) => {
        attempts++;
        if (attempts < 3) {
          return res.networkError('Failed to connect');
        }
        return res(ctx.json({ id: '123', name: 'John Doe' }));
      })
    );

    const user = await UserService.getById('123');
    expect(attempts).toBe(3);
    expect(user.name).toBe('John Doe');
  });
});
```

---

## 3. End-to-End Testing

### Playwright E2E Test

**User Registration Flow**:
```typescript
// registration.spec.ts

import { test, expect } from '@playwright/test';

test.describe('User Registration', () => {
  test('completes full registration flow', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/register');

    // Fill out form
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.fill('[name="confirmPassword"]', 'SecurePass123!');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await expect(page).toHaveURL('/dashboard');

    // Verify welcome message
    await expect(page.locator('h1')).toContainText('Welcome');

    // Verify user email appears
    await expect(page.locator('[data-testid="user-email"]')).toContainText(
      'test@example.com'
    );
  });

  test('shows validation errors for invalid input', async ({ page }) => {
    await page.goto('/register');

    // Submit without filling form
    await page.click('button[type="submit"]');

    // Check validation errors
    await expect(page.locator('.error-email')).toContainText(
      'Email is required'
    );
    await expect(page.locator('.error-password')).toContainText(
      'Password is required'
    );
  });

  test('prevents weak password', async ({ page }) => {
    await page.goto('/register');

    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'weak');

    await expect(page.locator('.password-strength')).toContainText('Too weak');
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });
});
```

---

## 4. Test Coverage

### Measuring Coverage

**Run with Coverage**:
```bash
# Vitest
npm test -- --coverage

# Jest
npm test -- --coverage --collectCoverageFrom='src/**/*.{ts,tsx}'
```

**Coverage Report**:
```
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |   87.3  |   85.2   |   89.5  |   87.9  |
 components/        |   92.1  |   88.4   |   95.2  |   92.5  |
  Button.tsx        |   95.0  |   90.0   |  100.0  |   95.5  | 45-47
  Input.tsx         |   91.2  |   85.7   |   92.3  |   91.0  | 78-82, 95
 utils/             |   78.5  |   76.3   |   80.0  |   78.9  |
  validation.ts     |   75.0  |   70.0   |   80.0  |   75.5  | 23-28, 45
--------------------|---------|----------|---------|---------|-------------------
```

### Coverage Config

**vitest.config.ts**:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/types.ts',
      ],
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
});
```

---

## 5. Test Patterns

### AAA Pattern (Arrange, Act, Assert)

```typescript
it('calculates total price with discount', () => {
  // Arrange
  const cart = {
    items: [
      { price: 100, quantity: 2 },
      { price: 50, quantity: 1 },
    ],
  };
  const discountCode = 'SAVE20';

  // Act
  const total = calculateTotal(cart, discountCode);

  // Assert
  expect(total).toBe(200); // (200 + 50) * 0.8 = 200
});
```

### Test Doubles

**Mock**:
```typescript
// Mock entire module
vi.mock('./userService', () => ({
  UserService: {
    getById: vi.fn().mockResolvedValue({ id: '123', name: 'John' }),
  },
}));
```

**Spy**:
```typescript
// Spy on existing method
const spy = vi.spyOn(console, 'error');
functionThatLogs();
expect(spy).toHaveBeenCalledWith('Error occurred');
```

**Stub**:
```typescript
// Replace method with custom implementation
vi.spyOn(Date, 'now').mockImplementation(() => 1609459200000);
```

---

## 6. Snapshot Testing

**Component Snapshot**:
```typescript
it('matches snapshot', () => {
  const { container } = render(<Button>Click me</Button>);
  expect(container.firstChild).toMatchSnapshot();
});
```

**Update Snapshots**:
```bash
npm test -- -u
```

---

## 7. Performance Testing

**Measure Render Time**:
```typescript
import { renderHook } from '@testing-library/react';
import { performance } from 'perf_hooks';

it('renders quickly', () => {
  const start = performance.now();
  render(<ExpensiveComponent />);
  const end = performance.now();

  expect(end - start).toBeLessThan(50); // <50ms
});
```

---

## 8. Accessibility Testing

**jest-axe**:
```typescript
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

it('has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 9. Visual Regression Testing

**Chromatic/Percy** (example workflow):
```typescript
// Storybook story
export const Primary = () => <Button variant="primary">Primary</Button>;

// Chromatic automatically captures screenshots
// Run: npx chromatic --project-token=<token>
```

---

## Best Practices

1. **Test behavior, not implementation**: Test what component does, not how
2. **One assertion per test**: Or at least test one concept
3. **Descriptive test names**: Should read like documentation
4. **Use test data builders**: For complex test setups
5. **Avoid testing private methods**: Test public API only
6. **Keep tests fast**: Unit tests should run in milliseconds
7. **Mock external dependencies**: Don't call real APIs in unit tests
8. **Test edge cases**: Empty arrays, null values, boundary conditions

---

## Coverage Goals

**By File Type**:
- **Utils/Helpers**: 100% coverage (pure functions, easy to test)
- **Components**: 80-90% coverage (UI logic)
- **Hooks**: 90%+ coverage (reusable logic)
- **API layers**: 80% coverage (integration tests)
- **E2E**: Critical user flows only (registration, checkout, etc.)

**Don't Aim for 100%**:
- Diminishing returns after 80-90%
- Some code is not worth testing (trivial getters)
- Focus on business logic and edge cases

---

## Related

- Commands: `/quality-check` (runs tests + coverage)
- Agents: `quality-assurance` (analyzes test results)
- Skills: `code-quality`
