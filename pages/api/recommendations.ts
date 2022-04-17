import type {NextApiRequest, NextApiResponse} from "next";

import api from "../../api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const token = req.cookies["token"];

    try {
      const tracks = await api.recommendations.tracks(token);

      return res.json(tracks);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}
