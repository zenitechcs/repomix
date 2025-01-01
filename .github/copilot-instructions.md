# Repomix Development Instructions

Repomix is a tool that packs repository contents into a single file for AI analysis. When modifying or adding code:

## Development Standards
- Use TypeScript with strict type checking and proper error handling via RepomixError class
- Support cross-platform compatibility (Windows/Unix paths)
- Use logger utility for console output and picocolors for colored text

## Core Architecture
- /src/core: Main file processing and packing logic
- /src/cli: Command-line interface components
- /src/config: Configuration management (Zod schemas)
- /src/shared: Common utilities and types

## Dependencies and Testing
- Inject dependencies through a deps object parameter for testability
- Example:
  ```typescript
  export const functionName = async (
    param1: Type1,
    param2: Type2,
    deps = {
      defaultFunction1,
      defaultFunction2,
    }
  ) => {
    // Use deps.defaultFunction1() instead of direct call
  };
  ```
- Mock dependencies by passing test doubles through deps object
- Use vi.mock() only when dependency injection is not feasible
