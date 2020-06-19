import { AnyField } from "@tinacms/forms";
import { AbstractField } from "./AbstractField";

export class ImageField extends AbstractField {
  async map(): Promise<AnyField> {
    this.tinaField.component = "image";

    this.tinaField.uploadDir = () => {
      return "";
    };
    this.tinaField.previewSrc = (values: any) => {
      //TODO have to add checks here
      return values[this.directusField.field]?.data?.full_url;
    };
    return this.tinaField;
  }
}
