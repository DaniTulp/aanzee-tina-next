import { AbstractField } from "./AbstractField";
import { Field } from "@tinacms/forms";

export class TextAreaField extends AbstractField {
  map(): Field {
    this.tinaField.component = "textarea";
    return this.tinaField;
  }
}
