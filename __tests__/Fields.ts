import { StatusField } from "src/fields/StatusField";
import { TextField } from "src/fields/TextField";

test("it should map a text field correctly", () => {
  const tinaField = new TextField({
    field: "text",
    required: true,
  }).map();

  expect(tinaField).toEqual(
    expect.objectContaining({
      component: "text",
    })
  );
  expect(tinaField.validate(null, {}, {}, tinaField)).toEqual("Required");
});

test("it should map a status field correctly", () => {
  const tinaField = new StatusField({
    field: "text",
    required: true,
    default_value: "draft",
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
  }).map();

  expect(tinaField).toEqual(
    expect.objectContaining({
      component: "select",
      options: [
        {
          label: "Published",
          value: "published",
        },
        {
          label: "Draft",
          value: "draft",
        },
        {
          label: "Deleted",
          value: "deleted"
        }
      ],
    })
  );
});
