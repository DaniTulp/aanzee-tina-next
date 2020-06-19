import { rest } from "msw";

interface LoginBody {
  email: string;
  password: string;
}

const handlers = [
  rest.get("/api", async (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.post("/api/auth/authenticate", async (req, res, ctx) => {
    const { email, password } = req.body as LoginBody;
    if (email !== "admin@example.com" || password !== "password") {
      return res(ctx.json({
        error: {
          code: 100,
          message: "Invalid user credentials"
        }
      }), ctx.status(404));
    }
    return res(
      ctx.json({
        data: {
          token: "valid token",
        },
      })
    );
  }),
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
            interface: "status",
          },
          {
            field: "this should be added as undefined",
            interface: "i-am-not-real",
          },
        ],
      })
    );
  }),
];
export { handlers };
