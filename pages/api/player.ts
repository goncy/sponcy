import type {Track} from "../../types";
import type {NextApiRequest, NextApiResponse} from "next";

import api from "../../api";

type Request = NextApiRequest & {
  body: Track;
};

export default async function handler(req: Request, res: NextApiResponse) {
  if (req.method === "POST") {
    const token = req.cookies["token"];

    try {
      const state = await api.player.play(token, req.body.uri);

      return res.json(state);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}
