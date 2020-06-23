import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { Tina, useDirectusFields } from "src";
import { TextField } from "src/fields/TextField";
import { rest, server } from "test/server";

const wrapper = ({ children }: any) => (
  <Tina options={{ url: "http://localhost/", project: "api" }}>{children}</Tina>
);

test("should be able to create tinacms form fields from directus fields and filter out readonly and hidden fields", async () => {
  const { result, waitForNextUpdate } = renderHook(
    () => useDirectusFields("news"),
    { wrapper }
  );

  await waitForNextUpdate();

  expect(result.current).toEqual([]);

  await waitForNextUpdate();

  expect(result.current.length).toEqual(2);
  expect(result.current[0]).toEqual(
    expect.objectContaining({
      component: "select",
      defaultValue: "draft",
      label: "status",
      name: "status",
    })
  );
  expect(result.current[1]).toEqual(
    expect.objectContaining({
      component: "undefined",
    })
  );
});

test("should be able to create tinacms form fields and override default", async () => {
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

  expect(result.current).toEqual([]);

await waitForNextUpdate();
  expect(result.current[0]).toEqual(
    expect.objectContaining({
      component: "text",
    })
  );
});
test("should show error when not authenticated", async () => {
  server.use(
    rest.get("/api/fields/:collection", async (req, res, ctx) => {
      return res.once(ctx.status(403));
    })
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
  expect(result.current).toEqual([]);
});
