import { AbstractField } from "./AbstractField";
import { IField } from "@directus/sdk-js/dist/types/schemes/directus/Field";
import SDK from "@directus/sdk-js";
import { AnyField } from "@tinacms/forms";

export class ImageField extends AbstractField {
  constructor(
    field: IField,
    private client: SDK,
    private collection: string,
    private id: number
  ) {
    super(field);
  }
  async map(): Promise<AnyField> {
    this.tinaField.component = "async-image";
    this.tinaField.onClear = async (values: any) => {
      await this.client.updateItem(this.collection, this.id, {
        [this.directusField.field]: null,
      });
    };
    this.tinaField.previewSrc = (values: any) => {
      //TODO have to add checks here
      return values[this.directusField.field]?.data?.full_url;
    };
    return this.tinaField;
  }
}
