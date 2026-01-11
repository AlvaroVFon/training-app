# Integration Flow Documentation Standards

When documenting a new user flow in `.docs/INTEGRATION_TESTS.md`, follow these guidelines:

## Structure

1.  **Title**: Use `## Flow X: Name of the Flow`.
2.  **Goal**: Briefly explain what the flow verifies.
3.  **Steps**:
    - Use code blocks for `curl` commands.
    - Export variables (like `TOKEN`, `ID`) to make steps copy-pasteable.
    - Use `jq` filters to extract IDs or verify values.

## Example Step

```bash
# Register a new entity
ENTITY_ID=$(curl -s -X POST http://localhost:3000/entities \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Entity"}' | jq -r .id)

# Verify creation
curl -s -X GET http://localhost:3000/entities/$ENTITY_ID \
  -H "Authorization: Bearer $TOKEN" | jq .
```

## Maintenance

- Ensure flows are idempotent if possible.
- If a new flow requires a certain database state, mention if `pnpm seed` is sufficient.
- Use the standard `http://localhost:3000` base URL.
