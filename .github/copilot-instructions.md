# Coding Guidelines
- Follow the Airbnb JavaScript Style Guide
- Suggest splitting files into smaller, focused units when appropriate
  - Keep code files under 250 lines, if the file is over 250 lines, split it into multiple files based on the functionality.
- Add comments for non-obvious logic. Keep all text in English
- All new features should have corresponding unit tests

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
