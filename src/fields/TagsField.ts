import { AbstractField } from "./AbstractField";
import { Field } from "@tinacms/forms";

export class TagsField extends AbstractField {
  map(): Field {
    this.tinaField.component = "tags";
    return this.tinaField;
  }
}
