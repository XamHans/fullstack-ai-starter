// db/schema.ts

import * as postsSchema from '../../modules/posts/schema';
import * as usersSchema from '../../modules/users/schema';

// Export everything from one place for easy access in your app
const schema = {
  ...usersSchema,
  ...postsSchema,
};

export default schema;
export * from '../../modules/posts/schema';
export * from '../../modules/users/schema';
