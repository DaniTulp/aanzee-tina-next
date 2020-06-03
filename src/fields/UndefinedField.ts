import { AbstractField } from "./AbstractField";
import { Field } from "tinacms";

export class UndefinedField extends AbstractField {
  map(): Field {
    // console.error(
    //   `Field ${this.directusField.field} with interface ${this.directusField.interface} is not defined`
    // );
    this.tinaField.component = "undefined";
    return this.tinaField;
  }
}
