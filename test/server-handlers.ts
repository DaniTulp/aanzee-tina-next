import { rest } from "msw";

const handlers = [
  rest.get("/api/fields/:collection", async (req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          {
            field: "this should not be added because of hidden_detail",
            interface: "id",
            hidden_detail: true,
            hidden_browse: false,
            required: false,
          },
          {
            field: "this should not be added because of readonly",
            interface: "id",
            readonly: true,
          },
          {
            field: "status",
            default_value: "draft",
            sort: 3,
            interface: "status",
          },
        ],
      })
    );
  }),
];
export { handlers };
