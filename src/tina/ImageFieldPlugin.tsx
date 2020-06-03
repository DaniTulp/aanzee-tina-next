import * as React from "react";
import { useCMS } from "@tinacms/react-core";
import {
  InputProps,
  wrapFieldsWithMeta,
  ImageUpload,
} from "@tinacms/fields";
import { FieldPlugin } from "tinacms";

type FieldProps = any;
interface ImageProps {
  path: string;
  previewSrc(form: any, field: FieldProps): Promise<string> | string;
  onClear(form: any, field: FieldProps): Promise<string> | string;
  clearable?: boolean; // defaults to true
}

export const ImageField = wrapFieldsWithMeta<InputProps, ImageProps>(
  (props) => {
    const cms = useCMS();
    const [previewSrc, setPreviewSrc] = React.useState("");
    React.useEffect(() => {
      async function getPreviewSrc() {
        const src = await props.field.previewSrc(
          props.form.getState().values,
          props
        );
        setPreviewSrc(src);
      }
      getPreviewSrc();
    }, [props.form.getState().values]);

    return (
      <ImageUpload
        value={props.input.value}
        previewSrc={previewSrc}
        onDrop={async ([file]: File[]) => {
          // @ts-ignore cms.media
          const [media] = await cms.media.store.persist([
            {
              file,
            },
          ]);
          if (media) {
            props.input.onChange(media.filename);
          } else {
            // TODO Handle failure
          }
        }}
        onClear={
          props.field.clearable === false
            ? undefined
            : async () => {
                await props.field.onClear(props.form.getState().values, props);
                props.input.onChange("");
              }
        }
      />
    );
  }
);

export const ImageFieldPlugin: FieldPlugin = {
  Component: ImageField,
  __type: "field",
  name: "async-image",
};
