import React, { ReactNode, useMemo } from "react";
import { HtmlFieldPlugin, MarkdownFieldPlugin } from "react-tinacms-editor";
import { createBrowserClient } from "src/lib/createDirectusClient";
import { DirectusProvider } from "src/react/DirectusProvider";
import {
  MediaStore,
  MediaUploadOptions,
  TinaCMS,
  TinaCMSConfig,
  TinaProvider
} from "tinacms";
import { DirectusMediaStore } from "./MediaStore";
import { SingleRelationFieldPlugin } from "./Relation/SingleRelationField";

export function Tina({
  children,
  config,
  options,
}: {
  children: ReactNode;
  config?: TinaCMSConfig;
  options: { url: string; project: string };
}) {
  const directusClient = createBrowserClient(options);
  const tinaCMSConfig: TinaCMSConfig = {
    sidebar: true,
    toolbar: true,
    media: {
      store:
        typeof window !== "undefined"
          ? new DirectusMediaStore(directusClient)
          : new DummyMediaStore(),
    },
    ...config,
  };

  const cms = useMemo(() => new TinaCMS(tinaCMSConfig), [tinaCMSConfig]);
  cms.fields.add(HtmlFieldPlugin);
  cms.fields.add(MarkdownFieldPlugin);
  cms.fields.add(SingleRelationFieldPlugin);
  return (
    <TinaProvider cms={cms}>
      <DirectusProvider client={directusClient}>{children}</DirectusProvider>
    </TinaProvider>
  );
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
