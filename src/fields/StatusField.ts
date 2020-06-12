import { AbstractField, FieldOption } from "./AbstractField";
import { AnyField } from "@tinacms/forms";

interface StatusFieldOption extends FieldOption {
  options: {
    [key: string]: {
      [key: string]: {
        name: string;
        value: string;
      };
    };
  };
}

export class StatusField extends AbstractField {
  constructor(protected directusField: StatusFieldOption) {
    super(directusField);
  }
  map(): AnyField {
    this.tinaField.component = "select";
    const statusMappings = Object.values(
      //Weird directus typeing issue
      //@ts-ignore
      this.directusField?.options?.status_mapping || {}
    );

    this.tinaField.options = statusMappings.map((status: any) => {
      return { label: status.name, value: status.value };
    });
    return this.tinaField;
  }
}
