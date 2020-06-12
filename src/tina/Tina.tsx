import React, { ReactNode, useMemo } from "react";
import {
  TinaProvider,
  MediaStore,
  MediaUploadOptions,
  TinaCMS,
  TinaCMSConfig,
} from "tinacms";
import { HtmlFieldPlugin, MarkdownFieldPlugin } from "react-tinacms-editor";
import { DirectusMediaStore } from "./MediaStore";
import { SingleRelationFieldPlugin } from "./Relation/SingleRelationField";
import { createBrowserClient } from "src/lib/createDirectusClient";

export function Tina({
  children,
  config,
}: {
  children: ReactNode;
  config?: TinaCMSConfig;
}) {
  const tinaCMSConfig: TinaCMSConfig = {
    media: {
      store:
        typeof window !== "undefined"
          ? new DirectusMediaStore(createBrowserClient())
          : new DummyMediaStore(),
    },
    ...config,
  };

  const cms = useMemo(() => new TinaCMS(tinaCMSConfig), [tinaCMSConfig]);
  cms.fields.add(HtmlFieldPlugin);
  cms.fields.add(MarkdownFieldPlugin);
  cms.fields.add(SingleRelationFieldPlugin);
  return <TinaProvider cms={cms}>{children}</TinaProvider>;
}
//TODO temporary fix.
class DummyMediaStore implements MediaStore {
  accept = "*";
  async persist(files: MediaUploadOptions[]) {
    alert("UPLOADING FILES");
    console.log(files);
    return files.map(({ directory, file }) => ({
      directory,
      filename: file.name,
    }));
  }
}
