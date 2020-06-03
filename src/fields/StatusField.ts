import { AbstractField } from "./AbstractField";
import { AnyField } from "@tinacms/forms";

export class StatusField extends AbstractField {
  map(): AnyField {
    this.tinaField.component = "select";
    const statusMappings = Object.values(
      //Weird directus typeing issue
      //@ts-ignore
      this.directusField.options?.status_mapping
    );

    this.tinaField.options = statusMappings.map((status: any) => {
      return { label: status.name, value: status.value };
    });
    return this.tinaField;
  }
}
