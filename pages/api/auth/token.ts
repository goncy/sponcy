import type {NextApiRequest, NextApiResponse} from "next";

import cookie from "cookie";

import api from "../../../api";

type GetRequest = NextApiRequest & {
  query: {
    code: string;
  };
};

type GetResponse = NextApiResponse<void | {error: unknown}>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const request = req as GetRequest;
    const response = res as GetResponse;

    try {
      const token = await api.authorization.exchange(request.query.code);

      response.setHeader(
        "Set-Cookie",
        cookie.serialize("token", token.access_token, {
          path: "/",
        }),
      );

      return response.redirect("/");
    } catch (error) {
      return response.status(500).json({error});
    }
  }
}
