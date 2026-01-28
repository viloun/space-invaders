# Agent Guidelines for Space Invaders Repository

This document provides instructions for agentic coding agents operating in this repository.

## Build, Lint, and Test Commands

### Build
```bash
npm run build       # Compile TypeScript to JavaScript
npm run dev         # Start development server with hot reload
npm run start       # Start production server
```

### Linting and Formatting
```bash
npm run lint        # Run ESLint on source files
npm run lint:fix    # Auto-fix linting issues
npm run format      # Format code with Prettier
npm run type-check  # Run TypeScript type checking
```

### Testing
```bash
npm test                                    # Run all tests
npm test -- --watch                         # Run tests in watch mode
npm test -- path/to/test.test.ts           # Run a single test file
npm test -- --testNamePattern="test name"   # Run tests matching a pattern
npm test -- --coverage                      # Generate coverage report
```

## Code Style Guidelines

### TypeScript & Type Safety
- Always enable strict mode in `tsconfig.json`
- Use explicit return types on functions (avoid implicit `any`)
- Prefer `interface` over `type` for object definitions
- Use `const` by default, `let` sparingly, never use `var`
- Avoid `any` type—use `unknown` with type guards if necessary
- Use discriminated unions for complex type hierarchies

### Naming Conventions
- Files: `kebab-case` for filenames (e.g., `game-state.ts`)
- Classes and Interfaces: `PascalCase` (e.g., `GameEngine`, `PlayerState`)
- Constants: `UPPER_SNAKE_CASE` for module-level constants (e.g., `MAX_ENEMIES`)
- Functions and Variables: `camelCase` (e.g., `calculateScore`, `enemyList`)
- React Components: `PascalCase` filenames matching component name
- Private class members: Prefix with underscore (e.g., `_internalState`)

### Imports and Exports
- Use ES6 `import`/`export` syntax
- Group imports: external packages first, then internal modules, blank line between groups
- Sort imports alphabetically within groups
- Named imports for utilities; default imports for components/classes
- Use path aliases defined in `tsconfig.json` (e.g., `@/components`, `@/utils`)

### Formatting
- Line length: 100 characters (enforced by Prettier)
- Indentation: 2 spaces
- Semicolons: Required at end of statements
- Trailing commas: Always in multiline structures
- Quotes: Single quotes for strings (`'string'`)
- Arrow functions: Preferred for callbacks

### Error Handling
- Never silently catch exceptions—handle or log them
- Use specific error types, not generic `Error`
- Provide context in error messages (include relevant data)
- Use try-catch for async operations; avoid empty catch blocks
- Log errors with stack traces in development/production

### Code Quality
- Functions should be under 50 lines; extract helpers if longer
- Avoid deeply nested conditions (max 3 levels); use early returns
- Use meaningful variable names; avoid single letters (except `i` in loops)
- Add JSDoc comments for exported functions and complex logic
- Keep comments up-to-date with code changes
- Prefer composition over inheritance

### Git Workflow
- Branch names: `feature/`, `fix/`, `refactor/`, `docs/` prefixes
- Commit messages: Present tense, descriptive (e.g., "Add enemy spawn logic")
- Include context in commit bodies for non-obvious changes
- Keep commits atomic and focused on single concerns

### Testing Standards
- Write tests alongside implementation
- Test file location: `src/__tests__/` or `.test.ts` suffix
- Aim for >80% code coverage on core game logic
- Use descriptive test names: `describe('ClassName', () => { it('should ...') })`
- Mock external dependencies; avoid testing third-party libraries
- Include both happy path and error cases

### Documentation
- Add README section for new features
- Include inline comments for algorithmic complexity
- Document public API in JSDoc format
- Update AGENTS.md if guidelines change

## Repository Structure (Typical)
```
src/
  components/          # React/UI components
  game/               # Core game logic
  utils/              # Utility functions
  types/              # TypeScript type definitions
  __tests__/          # Test files
public/               # Static assets
docs/                 # Documentation
.eslintrc.json        # ESLint configuration
tsconfig.json         # TypeScript configuration
package.json          # Project metadata and dependencies
AGENTS.md             # This file
```

## IDE and Editor Setup
- Install Prettier extension for code formatting
- Enable "Format on Save" in your editor
- Use ESLint extension to catch issues during development
- Enable TypeScript strict mode warnings

## Performance Considerations
- Profile before optimizing; use browser DevTools
- Memoize expensive game calculations
- Batch DOM updates when possible
- Lazy load non-critical assets
- Monitor frame rate; aim for 60 FPS on target devices

---

**Last updated:** January 2026
