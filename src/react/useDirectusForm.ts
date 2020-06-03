import { FormOptions, Field } from "tinacms";
import { useDirectusClient, useDirectusAuthClient } from "./useDirectus";
import { useEffect, useState } from "react";
import { useLocalForm } from "@tinacms/react-core";
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

export function useDirectusForm(
  collection: string,
  {
    label,
    formId,
    initialValues,
    customFields,
  }: {
    label?: string;
    formId?: any;
    initialValues: any;
    customFields?: {
      [key: string]: FieldConstructor;
    };
  }
) {
  const [client] = useDirectusAuthClient();
  const [resolvedFields, setResolvedFields] = useState<Field[]>([]);

  const formConfig: FormOptions<any, Field> = {
    initialValues,
    onSubmit: async (values: any) =>
      //TODO currently assume it has an id
      await client.updateItem(collection, initialValues.id, values),
    id: formId,
    label: label ?? "",
    fields: resolvedFields,
  };
  const [values, form] = useLocalForm(formConfig, {
    label,
    fields: resolvedFields,
  });
  const fields = useDirectusFields(collection, initialValues.id, customFields);
  useEffect(() => setResolvedFields(fields), [fields]);
  return [values, form];
}

export function useDirectusFields(
  collection: string,
  id: number,
  customFields?: {
    [key: string]: FieldConstructor;
  }
): Field[] {
  const [apiFields, setApiFields] = useState<IField[]>([]);
  const [fields, setFields] = useState<Field[]>([]);

  const client = useDirectusClient();

  useEffect(() => {
    async function getFields() {
      const apiFields = (await client.getFields(collection)).data
        //@ts-ignore
        .filter(({ hidden_detail, readonly }: IField) => {
          return !hidden_detail && !readonly;
        });
      //@ts-ignore
      setApiFields(apiFields);
    }
    getFields();
  }, [collection]);

  useEffect(() => {
    async function mapFields() {
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
      const fields = apiFields.map(async (field: IField) => {
        return await new map[
          map.hasOwnProperty(field.interface) ? field.interface : "text-input"
        ](field, client, collection, id).map();
      });
      setFields(await Promise.all(fields));
    }
    mapFields();
  }, [apiFields]);

  return fields;
}
