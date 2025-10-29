import * as auth from '@/modules/auth/schema';
import * as habits from '@/modules/habits/schema';
import * as households from '@/modules/households/schema';
import * as posts from '@/modules/posts/schema';
import * as users from '@/modules/users/schema';
import * as workflow from '@/modules/workflow/schema';

export const schema = {
  ...auth,
  ...households,
  ...users,
  ...habits,
  ...posts,
  ...workflow,
};

export default schema;
