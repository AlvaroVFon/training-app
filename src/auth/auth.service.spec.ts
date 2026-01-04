import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CryptoService } from '../crypto/crypto.service';
import { TokensService } from '../tokens/tokens.service';
import { User } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let cryptoService: CryptoService;
  let tokensService: TokensService;

  const mockUser = {
    _id: '695ab9a088d65bd0e8294d21',
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
    age: 30,
    toObject: jest.fn().mockReturnValue({
      _id: '695ab9a088d65bd0e8294d21',
      email: 'test@example.com',
      password: 'hashedPassword',
      name: 'Test User',
      age: 30,
    }),
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockCryptoService = {
    compareHash: jest.fn(),
  };

  const mockTokensService = {
    generateToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: CryptoService,
          useValue: mockCryptoService,
        },
        {
          provide: TokensService,
          useValue: mockTokensService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    cryptoService = module.get<CryptoService>(CryptoService);
    tokensService = module.get<TokensService>(TokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create a user and return login response', async () => {
      const createUserDto = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
        age: 25,
      };
      const token = 'jwt_token';
      mockUsersService.create.mockResolvedValue(mockUser);
      mockTokensService.generateToken.mockReturnValue(token);

      const result = await service.register(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result.access_token).toBe(token);
      expect(result.user).toEqual(mockUser);
    });
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockCryptoService.compareHash.mockReturnValue(true);

      const result = await service.validateUser({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
        true,
      );
      expect(cryptoService.compareHash).toHaveBeenCalledWith(
        'password123',
        'hashedPassword',
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser({
        email: 'notfound@example.com',
        password: 'password123',
      });

      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockCryptoService.compareHash.mockReturnValue(false);

      const result = await service.validateUser({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return user and an access token', () => {
      const token = 'jwt_token';
      mockTokensService.generateToken.mockReturnValue(token);

      const result = service.login(mockUser as any);

      expect(tokensService.generateToken).toHaveBeenCalledWith({
        sub: mockUser._id.toString(),
        type: 'access',
      });
      expect(result.access_token).toBe(token);
      expect(result.user.email).toBe(mockUser.email);
    });
  });
});
