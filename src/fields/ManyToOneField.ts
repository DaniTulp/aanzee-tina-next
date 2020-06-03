import { AbstractField } from "./AbstractField";
import { AnyField } from "@tinacms/forms";
import { IField } from "@directus/sdk-js/dist/types/schemes/directus/Field";
import SDK from "@directus/sdk-js";
export class ManyToOneField extends AbstractField {
  constructor(
    field: IField,
    private client: SDK,
    private collection: string,
  ) {
    super(field);
  }
  async map(): Promise<AnyField> {
    //TODO make this more dynamic.
    this.tinaField.component = "single-relation";
    const {
      // Weird typing issue from DirectusSDK
      // @ts-ignore
      data: { collection_one },
    } = await this.client.getRelations({
      single: 1,
      fields: ["collection_one"],
      filter: {
        // Weird typing issue from DirectusSDK
        //@ts-ignore
        collection_many: this.collection,
        //@ts-ignore
        field_many: this.tinaField.name,
      },
    });
    const { data } = await this.client.getItems(collection_one, {
      // Weird typing issue from DirectusSDK
      //@ts-ignore
      fields: `id,${this.directusField.options?.visible_fields}`,
      limit: -1,
    });
    // Weird typing issue from DirectusSDK
    //@ts-ignore
    const labelFields = this.directusField.options?.visible_fields.split(",");

    this.tinaField.itemProps = (item: any) => {
      let label = "";
      labelFields.forEach((part: string) => {
        label += `${item[part]} `;
      });
      return {
        key: `${item.id}`,
        label,
      };
    };
    this.tinaField.data = data;
    return this.tinaField;
  }
}
