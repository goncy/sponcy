import type {Track} from "./types";

import {stringify} from "querystring";

import axios from "axios";

const api = {
  authorization: {
    exchange: async (
      code: string,
    ): Promise<{
      access_token: string;
      expires_in: number;
    }> => {
      const data = await axios({
        method: "POST",
        url: "https://accounts.spotify.com/api/token",
        data: stringify({
          code,
          grant_type: "authorization_code",
          redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL,
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
        }),
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }).then((res) =>
        res.status === 200 ? res.data : Promise.reject("Failed exchanging the token"),
      );

      return data;
    },
  },
  player: {
    play: (token: string, id: string) => {
      return axios
        .put(
          "https://api.spotify.com/v1/me/player/play",
          {
            uris: [id],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => res.data);
    },
  },
  recommendations: {
    tracks: (token: string): Promise<Track[]> => {
      return axios
        .get("https://api.spotify.com/v1/recommendations", {
          params: {
            market: "AR",
            seed_genres: "electronic",
            limit: 10,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data)
        .then(
          (data: {tracks: {id: string; uri: string; artists: {name: string}[]; name: string}[]}) =>
            data.tracks.map((track) => ({
              id: track.id,
              uri: track.uri,
              artist: track["artists"][0]["name"],
              name: track["name"],
            })),
        );
    },
    genres: (token: string): Promise<string[]> => {
      return axios
        .get("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data);
    },
  },
};

export default api;
