import { AbstractField } from "./AbstractField";
import { Field } from "tinacms";

export class TextAreaField extends AbstractField {
  map(): Field {
    this.tinaField.component = "textarea";
    return this.tinaField;
  }
}
