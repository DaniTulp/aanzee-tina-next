import { IField } from "@directus/sdk-js/dist/types/schemes/directus/Field";
import { AnyField } from "@tinacms/forms";

export abstract class AbstractField implements Field {
  protected tinaField: AnyField;
  constructor(protected directusField: IField) {
    this.tinaField = {
      component: "",
      name: directusField.field,
      label: directusField.field.split(" ").join("_"),
      validate(value: any, values: any, meta: any, field: any) {
        if (field.required && !value) return "Required";
      },
    };
  }

  abstract map(): AnyField | Promise<AnyField>;
}

export interface FieldConstructor {
  new (directusField: IField, ...args: any[]): Field;
}

interface Field {
  map(): AnyField | Promise<AnyField>;
}
