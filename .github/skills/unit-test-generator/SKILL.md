---
name: unit-test-generator
description: Automated unit test generation for new functionalities using Jest. This skill ensures that every new controller, service, or repository has corresponding unit tests following the project's mocking and structure patterns.
---

# Unit Test Generator

This skill guides the creation of unit tests for new or modified features in the project.

## Workflow

1.  **Identify the target**: Determine which file needs tests (e.g., `src/feature/feature.service.ts`).
2.  **Create the spec file**: Create a file named `feature.service.spec.ts` in the same directory.
3.  **Apply standard patterns**: Use the project's established mocking and testing patterns.
    - See [patterns.md](references/patterns.md) for detailed code patterns and examples.
4.  **Cover success and error cases**:
    - Every public method should have at least one success test.
    - Edge cases and potential exceptions (e.g., `NotFoundException`, `ConflictException`) should be tested.
5.  **Verify isolation**: Ensure `jest.clearAllMocks()` is used in `afterEach` to prevent test contamination.

## Principles

- **Mock Dependencies**: Do not use real databases or external services. Mock all injected providers.
- **Consistent naming**: Follow the `describe('ClassName', ...)` and `describe('methodName', ...)` structure.
- **Minimal context**: Keep tests focused on the logic of the unit, not integration details.

## Quick Start Examples

### Testing a Service

- Link: [references/patterns.md#service-mocking-pattern](references/patterns.md)

### Testing a Repository (Mongoose)

- Link: [references/patterns.md#repositorymongoose-mocking-pattern](references/patterns.md)
