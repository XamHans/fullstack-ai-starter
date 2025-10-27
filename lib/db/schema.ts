import * as habits from '@/modules/habits/schema';
import * as households from '@/modules/households/schema';
import * as users from '@/modules/users/schema';

export const schema = {
  ...households,
  ...users,
  ...habits,
};
