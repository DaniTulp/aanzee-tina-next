import { AbstractField } from "./AbstractField";
import { Field } from "@tinacms/forms";

export class WysiwygField extends AbstractField {
  map(): Field {
    this.tinaField.component = "html";
    return this.tinaField;
  }
}
