import { AbstractField } from "./AbstractField";
import { IField } from "@directus/sdk-js/dist/types/schemes/directus/Field";
import SDK from "@directus/sdk-js";
import { AnyField } from "@tinacms/forms";

export class ImageField extends AbstractField {
  constructor(field: IField) {
    super(field);
  }
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
