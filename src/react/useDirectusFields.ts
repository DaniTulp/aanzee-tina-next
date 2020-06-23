import { IField } from "@directus/sdk-js/dist/types/schemes/directus/Field";
import { useEffect, useState } from "react";
import { Field, useCMS } from "tinacms";
import { FieldConstructor } from "../fields/AbstractField";
import { ImageField } from "../fields/ImageField";
import { ManyToOneField } from "../fields/ManyToOneField";
import { StatusField } from "../fields/StatusField";
import { TagsField } from "../fields/TagsField";
import { TextAreaField } from "../fields/TextAreaField";
import { TextField } from "../fields/TextField";
import { UndefinedField } from "../fields/UndefinedField";
import { WysiwygField } from "../fields/WysiwygField";
import { useAuth } from "./AuthProvider";
import { useDirectusClient } from "./DirectusProvider";

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
  const fieldMappings: {
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
  const cms = useCMS();
  const client = useDirectusClient();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    async function getFields() {
      try {
        const apiFields = ((await client.getFields(collection))
          .data as unknown) as IField[];

        const fields = apiFields
          .filter(({ hidden_detail, readonly }) => !hidden_detail && !readonly)
          .map(async (field: IField) => {
            return await new fieldMappings[
              fieldMappings.hasOwnProperty(field.interface)
                ? field.interface
                : "undefined"
            ](field, client, collection, id).map();
          });
        setFields(await Promise.all(fields));
      } catch (exception) {
        setFields([]);
        cms.alerts.error("Unauthorized");
      }
    }
    getFields();
  }, [collection, isAuthenticated]);

  return fields;
}
