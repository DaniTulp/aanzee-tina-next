import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { DirectusContext } from "src/react/useDirectus";
import { useDirectusFields } from "src/react/useDirectusFields";
import { TextField } from "src/fields/TextField";
import { Tina } from "src/tina/Tina";
import { createBrowserClient } from "src/lib/createDirectusClient";
jest.mock("@directus/sdk-js", () => ({
  __esmodule: true,
  SDK: jest.fn().mockImplementation(() => ({
    api: jest.fn(),
    getFields: async () => {
      return new Promise((resolve) => {
        resolve({
          data: [
            {
              collection: "news",
              field: "this should not be added because of hidden_detail",
              interface: "id",
              hidden_detail: true,
              hidden_browse: false,
              required: false,
            },
            {
              collection: "news",
              field: "this should not be added because of readonly",
              interface: "id",
              readonly: true,
            },
            {
              collection: "news",
              field: "status",
              default_value: "draft",
              sort: 3,
              interface: "status",
              hidden_detail: false,
              hidden_browse: false,
              required: false,
              readonly: false,
              options: {
                status_mapping: {
                  published: {
                    name: "Published",
                    value: "published",
                  },
                  draft: {
                    name: "Draft",
                    value: "draft",
                  },
                  deleted: {
                    name: "Deleted",
                    value: "deleted",
                  },
                },
              },
            },
          ],
        });
      });
    },
  })),
}));

test("should be able to create tinacms form fields from directus fields and filter out readonly and hidden fields", async () => {
  const wrapper = ({ children }: any) => (
    <Tina>
      <DirectusContext.Provider value={createBrowserClient()}>
        {children}
      </DirectusContext.Provider>
    </Tina>
  );
  const { result, waitForNextUpdate } = renderHook(
    () => useDirectusFields("news"),
    { wrapper }
  );
  expect(result.current).toEqual([]);

  await waitForNextUpdate();

  expect(result.current.length).toEqual(1);
  expect(result.current[0]).toEqual(
    expect.objectContaining({
      component: "select",
      defaultValue: "draft",
      label: "status",
      name: "status",
    })
  );
});

test("should be able to create tinacms form fields and override default", async () => {
  const wrapper = ({ children }: any) => (
    <Tina>
      <DirectusContext.Provider value={createBrowserClient()}>
        {children}
      </DirectusContext.Provider>
    </Tina>
  );
  const { result, waitForNextUpdate } = renderHook(
    () =>
      useDirectusFields("news", {
        customFields: {
          status: TextField,
        },
      }),
    { wrapper }
  );
  await waitForNextUpdate();
  expect(result.current[0]).toEqual(
    expect.objectContaining({
      component: "text",
    })
  );
});
