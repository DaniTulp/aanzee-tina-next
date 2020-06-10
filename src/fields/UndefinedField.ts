import { AbstractField } from "./AbstractField";
import { Field } from "@tinacms/forms";

export class UndefinedField extends AbstractField {
  map(): Field {
    //TODO add some docs or explanation how this works.
    // console.error(
    //   `Field ${this.directusField.field} with interface ${this.directusField.interface} is not defined`
    // );
    this.tinaField.component = "undefined";
    return this.tinaField;
  }
}
