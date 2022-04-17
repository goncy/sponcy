import type {AppProps} from "next/app";

import cookie from "js-cookie";
import {ChakraProvider, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";

import theme from "../theme";

const App: React.FC<AppProps> = ({Component, pageProps}) => {
  const [status, setStatus] = useState<"init" | "resolved" | "rejected">("init");

  useEffect(() => {
    const token = cookie.get("token");

    setStatus(token ? "resolved" : "rejected");
  }, []);

  return (
    <ChakraProvider theme={theme}>
      {status === "init" && <Text>Cargando...</Text>}
      {status === "resolved" && <Component {...pageProps} />}
      {status === "rejected" && (
        <a
          href={`https://accounts.spotify.com/authorize?redirect_uri=${encodeURIComponent(
            process.env.NEXT_PUBLIC_REDIRECT_URL as string,
          )}&client_id=${
            process.env.NEXT_PUBLIC_CLIENT_ID
          }&response_type=code&scope=user-read-private%20user-read-email%20playlist-read-private%20user-library-read%20user-library-modify%20user-top-read%20playlist-read-collaborative%20playlist-modify-public%20playlist-modify-private%20user-follow-read%20user-follow-modify%20user-read-currently-playing%20user-modify-playback-state%20user-read-recently-played%20user-read-playback-state`}
        >
          Autorizar
        </a>
      )}
    </ChakraProvider>
  );
};

export default App;
