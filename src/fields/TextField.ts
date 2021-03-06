import { AbstractField } from "./AbstractField";
import { Field } from "@tinacms/forms";

export class TextField extends AbstractField {
  map(): Field {
    this.tinaField.component = "text";
    return this.tinaField;
  }
}
