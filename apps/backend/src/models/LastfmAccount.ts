import { date, ksuid_string, object, string } from 'libs/validator';
import { RelationMappings } from 'objection';
import BaseModel from './BaseModel';
import type User from './User';

class LastfmAccount extends BaseModel {
  id!: string;
  userId!: string;
  name!: string;
  username!: string;
  registeredAt!: Date;

  user?: User;

  static struct = object({
    id: string(),
    userId: ksuid_string(),
    name: string(),
    username: string(),
    registeredAt: date(),
  });

  static relationMappings: RelationMappings = {
    user: {
      modelClass: 'User',
      relation: BaseModel.BelongsToOneRelation,
      join: {
        from: 'lastfmAccount.userId',
        to: 'user.id',
      },
    },
  };
}

export default LastfmAccount;
