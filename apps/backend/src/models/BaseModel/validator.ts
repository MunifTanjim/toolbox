import type { Pojo, ValidatorArgs } from 'objection';
import { ValidationError, Validator } from 'objection';
import { partial, validate } from 'superstruct';

export class StructValidator extends Validator {
  beforeValidate({ ctx, model }: ValidatorArgs): void {
    ctx.modelClass = model.constructor;
    ctx.struct = ctx.modelClass.struct;
  }

  validate({ ctx, json, options }: ValidatorArgs): Pojo {
    if (!ctx.struct) {
      return json;
    }

    const struct = options.patch ? partial(ctx.struct) : ctx.struct;

    const [error, value] = validate(json, struct, {
      coerce: !options.patch,
    });

    if (error) {
      throw new ValidationError({
        data: error,
        message: error.message,
        modelClass: ctx.modelClass,
        type: 'ModelValidation',
      });
    }

    return value as Pojo;
  }
}
