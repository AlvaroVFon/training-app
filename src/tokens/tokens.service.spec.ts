import { Test, TestingModule } from '@nestjs/testing';
import { TokenPayload, TokensService } from './tokens.service';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Role } from '../auth/enums/role.enum';

describe('TokensService', () => {
  let service: TokensService;

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue: string) => {
      if (key === 'jwtExpiration') return '1h';
      if (key === 'jwtSecret') return 'testSecret';
      return defaultValue;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokensService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<TokensService>(TokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token with sub', () => {
      const payload: TokenPayload = {
        sub: '123',
        roles: [Role.USER],
        type: 'access',
      };

      const token = service.generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const decoded = jwt.verify(token, 'testSecret') as any;
      expect(decoded.sub).toBe(payload.sub);
      expect(decoded.roles).toEqual(payload.roles);
      expect(decoded.type).toBe(payload.type);
    });

    it('should generate a valid JWT token with sub and type', () => {
      const payload: TokenPayload = {
        sub: '123',
        roles: [Role.USER],
        type: 'access',
      };
      const token = service.generateToken(payload);

      expect(token).toBeDefined();
      const decoded = jwt.verify(token, 'testSecret') as any;
      expect(decoded.sub).toBe(payload.sub);
      expect(decoded.roles).toEqual(payload.roles);
      expect(decoded.type).toBe(payload.type);
    });
  });
});
