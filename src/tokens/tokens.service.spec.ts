import { Test, TestingModule } from '@nestjs/testing';
import { TokensService } from './tokens.service';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

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
    it('should generate a valid JWT token with userId', () => {
      const payload = { userId: '123' };
      const token = service.generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const decoded = jwt.verify(token, 'testSecret') as any;
      expect(decoded.userId).toBe(payload.userId);
    });

    it('should generate a valid JWT token with userId and type', () => {
      const payload = { userId: '123', type: 'access' };
      const token = service.generateToken(payload);

      expect(token).toBeDefined();
      const decoded = jwt.verify(token, 'testSecret') as any;
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.type).toBe(payload.type);
    });
  });
});
