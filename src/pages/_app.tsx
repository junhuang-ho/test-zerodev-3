import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  RainbowKitProvider,
  type Theme,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import {
  coinbaseWallet,
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import {
  googleWallet,
  facebookWallet,
  githubWallet,
  discordWallet,
  twitchWallet,
  twitterWallet,
  enhanceWalletWithAAConnector,
} from "@zerodevapp/wagmi/rainbowkit";

const ZERODEV_PROJECT_ID = "";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { chains, provider, webSocketProvider } = configureChains(
    [polygonMumbai],
    [
      alchemyProvider({
        apiKey: "",
      }),
      publicProvider(),
    ]
  );

  const connectors = connectorsForWallets([
    // Enabling this makes it buggy
    {
      groupName: "Social",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      wallets: [
        googleWallet({
          chains: chains,
          options: { projectId: ZERODEV_PROJECT_ID },
        }),
        facebookWallet({
          chains: chains,
          options: { projectId: ZERODEV_PROJECT_ID },
        }),
        githubWallet({
          chains: chains,
          options: { projectId: ZERODEV_PROJECT_ID },
        }),
        discordWallet({
          chains: chains,
          options: { projectId: ZERODEV_PROJECT_ID },
        }),
        twitchWallet({
          chains: chains,
          options: { projectId: ZERODEV_PROJECT_ID },
        }),
        twitterWallet({
          chains: chains,
          options: { projectId: ZERODEV_PROJECT_ID },
        }),
      ],
    },
    {
      groupName: "Web3",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      wallets: [
        enhanceWalletWithAAConnector(metaMaskWallet({ chains: chains }), {
          projectId: ZERODEV_PROJECT_ID,
        }),
        enhanceWalletWithAAConnector(
          coinbaseWallet({ appName: "test", chains: chains }),
          { projectId: ZERODEV_PROJECT_ID }
        ),
      ],
    },
    // Enabling this = no buggy
    // {
    //   groupName: "Popular",
    //   wallets: [
    //     metaMaskWallet({ chains: chains }),
    //     coinbaseWallet({ appName: "test", chains: chains }),
    //   ],
    // },
  ]);

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
    webSocketProvider,
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider session={session}>
        <RainbowKitProvider
          appInfo={{
            appName: "test",
          }}
          chains={chains}
          modalSize="compact"
        >
          <Component {...pageProps} />
        </RainbowKitProvider>
      </SessionProvider>
    </WagmiConfig>
  );
};

export default api.withTRPC(MyApp);
