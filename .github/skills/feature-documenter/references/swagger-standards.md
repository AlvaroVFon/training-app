# Swagger/OpenAPI Standards

## Controller Decorators

Every controller and endpoint must be documented using `@nestjs/swagger` decorators.

### Class Level

- `@ApiTags('module-name')`: Categorize endpoints.
- `@ApiBearerAuth()`: If authentication is required.
- `@ApiExtraModels(PaginatedResponseDto, MyDto)`: Required if using generic response types.

### Endpoint Level

- `@ApiOperation({ summary: 'Concise description' })`
- `@ApiResponse({ status: 200, description: 'Success', type: MyDto })`
- `@ApiResponse({ status: 404, description: 'Not Found' })`

## DTO Decorators

Properties in DTOs should have `@ApiProperty()`.

```typescript
export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  name: string;

  @ApiProperty({ example: 25, minimum: 18 })
  age: number;
}
```

## Paginated Responses

When returning paginated data, use the `PaginatedResponseDto` combined with `getSchemaPath`.

```typescript
@Get()
@ApiOperation({ summary: 'Get all items' })
@ApiResponse({
  status: 200,
  schema: {
    allOf: [
      { $ref: getSchemaPath(PaginatedResponseDto) },
      {
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(MyDto) },
          },
        },
      },
    ],
  },
})
findAll() { ... }
```
