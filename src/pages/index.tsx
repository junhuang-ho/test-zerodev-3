import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";

import { ConnectButton } from "@rainbow-me/rainbowkit";

import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { push } = useRouter();

  return (
    <div>
      <ConnectButton />
      <button
        onClick={async () => {
          await push("/page1");
        }}
      >
        go page 1
      </button>
      <button
        onClick={async () => {
          await push("/page2");
        }}
      >
        go page 2
      </button>
    </div>
  );
};

export default Home;
