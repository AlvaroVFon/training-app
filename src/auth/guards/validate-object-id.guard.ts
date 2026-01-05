import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ValidateObjectIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const params = request.params;

    for (const key in params) {
      const value = params[key];
      if (
        (key === 'id' || key.toLowerCase().endsWith('id')) &&
        value &&
        !Types.ObjectId.isValid(value)
      ) {
        throw new BadRequestException(
          `Invalid ID format for parameter: ${key}`,
        );
      }
    }

    return true;
  }
}
