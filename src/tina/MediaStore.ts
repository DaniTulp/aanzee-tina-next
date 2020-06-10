import SDK from "@directus/sdk-js";
import { IFileResponse } from "@directus/sdk-js/dist/types/schemes/response/File";
import { MediaStore, Media, MediaUploadOptions } from "tinacms";

export class DirectusMediaStore implements MediaStore {
  accept = "*";

  constructor(private client: SDK) {
    //
  }

  async persist(files: MediaUploadOptions[]): Promise<Media[]> {
    const uploaded: Media[] = [];
    for (const { file } of files) {
      try {
        const content = (await base64File(file)).toString().split(",")[1];
        const { data } = await this.uploadFile({
          filename_disk: file.name,
          filename_download: file.name,
          data: content,
        });
        uploaded.push({
          directory: "",
          // @ts-ignore
          filename: data,
        });
      } catch (e) {
        console.error(e);
      }
    }

    return uploaded;
  }
  uploadFile(file: object): Promise<IFileResponse> {
    const headers: { [index: string]: any } = {
      "X-Directus-Project": this.client.config.project,
    };

    if (this.client.config.token && this.client.config.token.length > 0) {
      headers["Authorization"] = `Bearer ${this.client.config.token}`;
    }

    return this.client.api.post("/files", file, {
      headers,
    });
  }
}
function base64File(file: Blob): Promise<string | ArrayBuffer> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result);
      } else {
        throw new Error("base64File: No result");
      }
    };
  });
}
