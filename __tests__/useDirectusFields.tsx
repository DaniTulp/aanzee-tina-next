import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { DirectusContext } from "src/react/useDirectus";
import { useDirectusFields } from "src/react/useDirectusFields";
import { TextField } from "src/fields/TextField";
import { Tina } from "src/tina/Tina";
import { createBrowserClient } from "src/lib/createDirectusClient";

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
