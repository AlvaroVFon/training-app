import { ProfileDto } from '../auth/dto/profile.dto';
import { UserDto } from './dto/user.dto';

export const toProfileDto = (user: UserDto): ProfileDto => {
  const { email, name, age, roles } = user;
  const userId = user.id || user._id;

  return {
    id: userId?.toString() || '',
    email,
    name,
    age,
    roles,
  };
};
