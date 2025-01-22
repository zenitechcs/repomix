# Coding Guidelines
- Follow the Airbnb JavaScript Style Guide.
- Split files into smaller, focused units when appropriate:
  - Aim to keep code files under 250 lines. If a file exceeds 250 lines, split it into multiple files based on functionality.
- Add comments to clarify non-obvious logic. **Ensure all comments are written in English.**
- Provide corresponding unit tests for all new features.

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
