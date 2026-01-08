import { ProfileDto } from '../auth/dto/profile.dto';
import { UserDto } from './dto/user.dto';

export const toProfileDto = (user: UserDto): ProfileDto => {
  const { id, email, name, age, roles } = user;
  return {
    id: id?.toString(),
    email,
    name,
    age,
    roles,
  };
};
