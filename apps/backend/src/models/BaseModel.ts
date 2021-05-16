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
} from 'objection';
import { Model } from 'objection';
import path from 'path';

const modelPaths = [path.resolve(__dirname)];

/* Modifiers */
const selectId = <M extends Model, R>(
  query: QueryBuilder<M, R>
): QueryBuilder<M, R> => query.select('id');
/* Modifiers */

const queryMethodSymbol = Symbol('objection-model-static-query-method');
const relatedQueryMethodSymbol = Symbol(
  'objection-model-static-related-query-method'
);

class BaseModel extends Model {
  created!: Date;
  updated!: Date;

  static [queryMethodSymbol] = Model.query;
  static [relatedQueryMethodSymbol] = Model.relatedQuery;

  static query<M extends Model>(
    this: Constructor<M> & { [queryMethodSymbol]: ModelClass<M>['query'] },
    trxOrKnexOrType?: TransactionOrKnex | 'read' | 'write'
  ): QueryBuilderType<M> {
    if (typeof trxOrKnexOrType === 'string') {
      return this[queryMethodSymbol](pickKnex(trxOrKnexOrType)).skipUndefined();
    }

    return this[queryMethodSymbol](trxOrKnexOrType).skipUndefined();
  }

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

export default BaseModel;
