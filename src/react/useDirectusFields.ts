import { useDirectusClient } from "./useDirectus";
import { useEffect, useState } from "react";
import { IField } from "@directus/sdk-js/dist/types/schemes/directus/Field";
import { TextAreaField } from "../fields/TextAreaField";
import { FieldConstructor } from "../fields/AbstractField";
import { ManyToOneField } from "../fields/ManyToOneField";
import { TextField } from "../fields/TextField";
import { WysiwygField } from "../fields/WysiwygField";
import { ImageField } from "../fields/ImageField";
import { StatusField } from "../fields/StatusField";
import { UndefinedField } from "../fields/UndefinedField";
import { TagsField } from "../fields/TagsField";
import { Field, useCMS } from "tinacms";

type FieldOptions = {
  customFields?: {
    [key: string]: FieldConstructor;
  };
  id?: number;
};

export function useDirectusFields(
  collection: string,
  { customFields, id }: FieldOptions = {}
): Field[] {
  const map: {
    [key: string]: FieldConstructor;
  } = {
    textarea: TextAreaField,
    wysiwyg: WysiwygField,
    "text-input": TextField,
    "many-to-one": ManyToOneField,
    file: ImageField,
    status: StatusField,
    undefined: UndefinedField,
    tags: TagsField,
    ...customFields,
  };
  const [fields, setFields] = useState<Field[]>([]);
  //TODO check if cms is available or throw error.
  const cms = useCMS();
  const client = useDirectusClient();
  useEffect(() => {
    async function getFields() {
      try {
        const apiFields = ((await client.getFields(collection)).data.filter(
          //@ts-ignore
          ({ hidden_detail, readonly }: IField) => !hidden_detail && !readonly
        ) as unknown) as IField[];
        const fields = apiFields.map(async (field: IField) => {
          return await new map[
            map.hasOwnProperty(field.interface) ? field.interface : "undefined"
          ](field, client, collection, id).map();
        });
        setFields(await Promise.all(fields));
      } catch (exception) {
        cms.alerts.error("Unauthorized")
      }
    }
    getFields();
  }, [collection]);

  return fields;
}
