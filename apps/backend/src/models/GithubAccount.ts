import { email, ksuid_string, number, object, string } from 'libs/validator';
import type { RelationMappings } from 'objection';
import BaseModel from './BaseModel';
import type User from './User';

class GithubAccount extends BaseModel {
  id!: number;
  userId!: string;
  name!: string;
  email!: string;

  user?: User;

  static struct = object({
    id: number(),
    userId: ksuid_string(),
    name: string(),
    email: email(),
  });

  static relationMappings: RelationMappings = {
    user: {
      modelClass: 'User',
      relation: BaseModel.BelongsToOneRelation,
      join: {
        from: 'githubAccount.userId',
        to: 'user.id',
      },
    },
  };
}

export default GithubAccount;
