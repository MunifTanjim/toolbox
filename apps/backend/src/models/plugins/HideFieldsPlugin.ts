import type { Plugin } from 'objection';

export const HideFieldsPlugin =
  (columnNames: string[]): Plugin =>
  <M>(Model: M): M => {
    if (!Array.isArray(columnNames)) {
      throw new Error('columnNames must be array');
    }

    // @ts-ignore sorry mate, no other way of doing it...
    return class extends Model {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      $formatJson(json: any) {
        json = super.$formatJson(json);

        columnNames.forEach((columnName) => {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete json[columnName];
        });

        return json;
      }
    };
  };

export default HideFieldsPlugin;
