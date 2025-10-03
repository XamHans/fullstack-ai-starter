// db/schema.ts

import * as postsSchema from '../../modules/posts/schema';
import * as usersSchema from '../../modules/users/schema';
import * as workflowSchema from '../../modules/workflow/schema';

// Export everything from one place for easy access in your app
const schema = {
  ...usersSchema,
  ...postsSchema,
  ...workflowSchema,
};

export default schema;
export * from '../../modules/posts/schema';
export * from '../../modules/users/schema';
export * from '../../modules/workflow/schema';
