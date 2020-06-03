import { AbstractField } from "./AbstractField";
import { Field } from "tinacms";

export class WysiwygField extends AbstractField {
  map(): Field {
    this.tinaField.component = "html";
    return this.tinaField;
  }
}
