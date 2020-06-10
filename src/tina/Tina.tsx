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
import { ImageFieldPlugin } from "./ImageFieldPlugin";
import { SingleRelationFieldPlugin } from "./Relation/SingleRelationField";
import { createBrowserClient } from "./../lib/createDirectusClient";

export function Tina({ children }: { children: ReactNode }) {
  const config: TinaCMSConfig = {
    media: {
      store:
        typeof window !== "undefined"
          ? new DirectusMediaStore(createBrowserClient())
          : new DummyMediaStore(),
    },
  };

  const cms = useMemo(() => new TinaCMS(config), [config]);
  cms.fields.add(HtmlFieldPlugin);
  cms.fields.add(MarkdownFieldPlugin);
  cms.fields.add(ImageFieldPlugin);
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
