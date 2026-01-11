# Jest Unit Testing Patterns

## Service Mocking Pattern

When testing services, mock all dependencies (repositories, other services) using `jest.fn()`.

```typescript
const mockUsersRepository = {
  create: jest.fn(),
  findOne: jest.fn(),
  // ... other methods
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const dto = {
        /* ... */
      };
      mockUsersRepository.create.mockResolvedValue({ id: '1', ...dto });

      const result = await service.create(dto);

      expect(result).toEqual({ id: '1', ...dto });
      expect(mockUsersRepository.create).toHaveBeenCalledWith(dto);
    });
  });
});
```

## Common Dependencies Mocking

### PaginationService

Since many services use `PaginationService`, use this mock structure:

```typescript
const mockPaginationService = {
  getPaginationParams: jest.fn().mockReturnValue({ page: 1, limit: 10 }),
  calculateMeta: jest.fn().mockReturnValue({
    total: 1,
    page: 1,
    lastPage: 1,
    limit: 10,
  }),
};
```

## Repository/Mongoose Mocking Pattern

For repositories that use Mongoose models, mock the model's chainable methods.

```typescript
const mockModel = {
  create: jest.fn(),
  find: jest.fn().mockReturnValue({
    exec: jest.fn(),
  }),
  findOne: jest.fn().mockReturnValue({
    exec: jest.fn(),
  }),
};

// Use generic mock for chainable methods if needed
const mockQuery = {
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  exec: jest.fn(),
};
```

## Common Assertions

- Use `expect(result).toEqual(expected)` for object equality.
- Use `expect(mock).toHaveBeenCalledWith(args)` to verify dependency interaction.
- Use `expect(service.method()).rejects.toThrow(ConflictException)` for error cases.

## File Placement

Place `.spec.ts` files in the same directory as the file being tested.

- `src/users/users.service.ts` -> `src/users/users.service.spec.ts`
- `src/users/users.controller.ts` -> `src/users/users.controller.spec.ts`
