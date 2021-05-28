import {
  boolean,
  defaulted,
  email,
  ksuid_string,
  object,
  string,
} from 'libs/validator';
import type { RelationMappings } from 'objection';
import { getKsuid } from 'utils/ksuid';
import BaseModel from './BaseModel';
import type GithubAccount from './GithubAccount';

class User extends BaseModel {
  id!: string;
  name!: string;
  email!: string;
  emailVerified!: boolean;

  githubAccount?: GithubAccount;

  static struct = object({
    id: defaulted(ksuid_string(), () => getKsuid().string),
    name: string(),
    email: email(),
    emailVerified: boolean(),
  });

  static relationMappings: RelationMappings = {
    githubAccount: {
      modelClass: 'GithubAccount',
      relation: BaseModel.HasOneRelation,
      join: {
        from: 'user.id',
        to: 'githubAccount.userId',
      },
    },
  };
}

export default User;
