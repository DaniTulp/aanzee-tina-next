import { AnyField } from "@tinacms/forms";

export interface FieldOption {
  default_value?: any;
  field: string;
  required?: boolean;
  interface?: string
}

export abstract class AbstractField implements Field {
  protected tinaField: AnyField;
  constructor(protected directusField: FieldOption) {
    //TODO create own type doesn't need all the directus fields
    this.tinaField = {
      defaultValue: directusField.default_value,
      component: "",
      name: directusField.field,
      label: directusField.field.split(" ").join("_"),
      validate(value: any, values: any, meta: any, field: any) {
        if (directusField.required && !value) return "Required";
      },
    };
  }

  abstract map(): AnyField | Promise<AnyField>;
}

export interface FieldConstructor {
  new (directusField: FieldOption, ...args: any[]): Field;
}

interface Field {
  map(): AnyField | Promise<AnyField>;
}
