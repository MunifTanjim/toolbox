import { pickKnex } from 'libs/database';
import { camelCase } from 'lodash';
import type {
  ArrayRelatedQueryBuilder,
  Constructor,
  ModelClass,
  Modifiers,
  QueryBuilder,
  QueryBuilderType,
  TransactionOrKnex,
  Validator,
} from 'objection';
import { Model } from 'objection';
import path from 'path';
import type { Struct } from 'superstruct';
import { StructValidator } from './validator';

const modelPaths = [path.resolve(__dirname, '..')];

/* Modifiers */
const selectId = <M extends Model, R>(
  query: QueryBuilder<M, R>
): QueryBuilder<M, R> => query.select('id');
/* Modifiers */

const queryMethodSymbol = Symbol('objection-model-static-query-method');
const relatedQueryMethodSymbol = Symbol(
  'objection-model-static-related-query-method'
);

export class BaseModel extends Model {
  createdAt!: Date;
  updatedAt!: Date;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static struct: Struct<any, any>;

  static createValidator(): Validator {
    return new StructValidator();
  }

  static [queryMethodSymbol] = Model.query;
  static query<M extends Model>(
    this: Constructor<M> & { [queryMethodSymbol]: ModelClass<M>['query'] },
    trxOrKnexOrType?: TransactionOrKnex | 'read' | 'write'
  ): QueryBuilderType<M> {
    if (typeof trxOrKnexOrType === 'string') {
      return this[queryMethodSymbol](pickKnex(trxOrKnexOrType)).skipUndefined();
    }

    return this[queryMethodSymbol](trxOrKnexOrType).skipUndefined();
  }

  static [relatedQueryMethodSymbol] = Model.relatedQuery;
  static relatedQuery<M extends Model, K extends keyof M>(
    this: Constructor<M> & {
      [relatedQueryMethodSymbol]: ModelClass<M>['relatedQuery'];
    },
    relationName: K,
    trxOrKnexOrType?: TransactionOrKnex | 'read' | 'write'
  ): ArrayRelatedQueryBuilder<M[K]> {
    if (typeof trxOrKnexOrType === 'string') {
      return this[relatedQueryMethodSymbol](
        relationName,
        pickKnex(trxOrKnexOrType)
      ).skipUndefined();
    }

    return this[relatedQueryMethodSymbol](
      relationName,
      trxOrKnexOrType
    ).skipUndefined();
  }

  static modelPaths = modelPaths;

  static get tableName(): string {
    return camelCase(this.prototype.constructor.name);
  }

  static modifiers: Modifiers = {
    selectId,
  };
}

BaseModel.knex(pickKnex());

export default BaseModel;
