import type {NextPage} from "next";
import type {Track} from "../types";

import {Stack, Text, Button} from "@chakra-ui/react";
import axios from "axios";
import {useEffect, useState} from "react";

const api = {
  player: {
    play: (track: Track) => axios.post("/api/player", track),
  },
  recommendations: {
    tracks: () => axios.get("/api/recommendations").then((res) => res.data),
  },
};

const Home: NextPage = () => {
  const [isShuffle, toggleShuffle] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [status, setStatus] = useState<"init" | "resolved" | "rejected">("init");

  function handlePlaySong(track: Track) {
    toggleShuffle(false);

    api.player.play(track);
  }

  function getTracks() {
    setStatus("init");

    api.recommendations
      .tracks()
      .then((tracks) => {
        setTracks(tracks);
        setStatus("resolved");
      })
      .catch(() => setStatus("rejected"));
  }

  useEffect(() => {
    getTracks();
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isShuffle) {
      api.player.play(tracks[0]);

      timeout = setTimeout(() => {
        getTracks();
      }, 10000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isShuffle, tracks]);

  if (status === "init") return <Text>Cargando...</Text>;
  if (status === "rejected") return <Text>Algo falló...</Text>;

  return (
    <main>
      <Stack>
        {tracks.map((track) => (
          <Stack key={`${track.artist} - ${track.name}`} alignItems="center" direction="row">
            <Text>{`${track.artist} - ${track.name}`}</Text>
            <Button onClick={() => handlePlaySong(track)}>Play</Button>
          </Stack>
        ))}
        {isShuffle ? (
          <Button colorScheme="red" onClick={() => toggleShuffle(false)}>
            Stop shuffle
          </Button>
        ) : (
          <Button colorScheme="green" onClick={() => toggleShuffle(true)}>
            Start shuffle
          </Button>
        )}
        <Button onClick={getTracks}>Get new recommendations</Button>
      </Stack>
    </main>
  );
};

export default Home;
