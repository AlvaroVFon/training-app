---
name: feature-documenter
description: Skill for documenting new functionalities. Ensures Swagger/OpenAPI decorators are present in code and updates external documentation files like .docs/GENERAL.md and .docs/INTEGRATION_TESTS.md.
---

# Feature Documenter

This skill ensures that every new functionality is properly documented both in-code and in external documentation files.

## Workflow

1.  **Code-level Documentation (Swagger)**:
    - Ensure all new controllers have `@ApiTags`.
    - Every new endpoint must have `@ApiOperation` and at least one `@ApiResponse`.
    - Use `@ApiProperty` in DTOs.
    - Reference [swagger-standards.md](references/swagger-standards.md) for implementation details.

2.  **Project Overview Update**:
    - If the feature introduces a new module or a significant architectural change, update [.docs/GENERAL.md](.docs/GENERAL.md).
    - Add the new feature to the "Core Features" or "Architecture" section.

3.  **Integration Flow Documentation**:
    - Add a new "Flow" to [.docs/INTEGRATION_TESTS.md](.docs/INTEGRATION_TESTS.md) demonstrating how to use the feature via `curl`.
    - Reference [integration-flow-standards.md](references/integration-flow-standards.md) for the expected format.

4.  **README Maintenance**:
    - Check if the root [README.md](README.md) needs an update (e.g., if a new setup step is required).

## Principles

- **Single Source of Truth**: Favor automated Swagger docs for API details. Use `.docs/` for higher-level architectural context and integration scenarios.
- **Reproducibility**: `curl` examples must be executable directly from the documentation.
- **Consistency**: Keep the same tone and structure as existing project documentation.
