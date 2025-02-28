"use client";

import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import {
  CHAIN_NAMESPACES,
  IAdapter,
  IProvider,
  WEB3AUTH_NETWORK,
} from "@web3auth/base";
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";

import RPC from "./web3RPC";
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";

import { useEffect, useState } from "react";
import { useWeb3Auth } from "@/contexts/Web3AuthContext";

const clientID =
  "BDxH3849Cz4CmifMBNT8XFoGlmP8WmZN8GOLcfAs9BIi7JqxRwpO-MKXqVJr3bdWsbLKhsVEfBbsu09JGDUWgIQ";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x8274f",
  rpcTarget: "https://sepolia-rpc.scroll.io",
  // Avoid using public rpcTarget in production.
  // Use services like Infura, Quicknode etc
  displayName: "Scroll Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.scroll.io",
  ticker: "ETH",
  tickerName: "Ether",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new CommonPrivateKeyProvider({
  config: {
    chainConfig,
  },
});

const web3AuthOptions: Web3AuthOptions = {
  clientId: clientID,
  privateKeyProvider,
  web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
};

const web3auth = new Web3Auth(web3AuthOptions);

export default function LoginDrugstore() {
  const web3AuthContext = useWeb3Auth();
  const user = web3AuthContext?.user;
  const login = web3AuthContext?.login;
  const logout = web3AuthContext?.logout;

  useEffect(() => {
    if (user) {
      console.log("User is logged in", user);
    }
    console.log("user", user);
  }, [user]);

  return (
    <div className="flex flex-row w-full min-h-screen">
      <div className="h-screen w-[40%] bg-red-500 flex flex-col justify-center items-center p-8 gap-8">
        <div className="flex flex-row items-center gap-4 text-5xl text-white font-semibold">
          <Image src="/logo.svg" alt="Pillchain" width={100} height={100} />
          <h1>PillChain</h1>
        </div>
        <h1 className="text-3xl font-bold text-white">
          Vamos juntos garantir a segurança nas vendas de medicamentos para toda
          a população brasileira!
        </h1>
      </div>
      <div className="h-screen w-[60%] flex flex-col justify-center items-center p-8 gap-8">
        <main className="flex-1 container mx-auto flex justify-center items-center">
          <div className="w-full max-w-md bg-white rounded-md shadow-sm border border-[#e0e0e0] p-8">
            <h1 className="text-center text-2xl font-bold mb-8">
              Já é usuário?
            </h1>
            <div className="space-y-4">
              <div className="space-y-1">
                <TextField
                  label="Email ou CRM"
                  variant="outlined"
                  size="medium"
                  fullWidth
                />
              </div>
              <button
                onClick={login}
                className="bg-[#D5A021] text-white rounded-md py-3 px-6 flex items-center justify-center gap-2"
              >
                Fazer Login
              </button>
              <div className="mt-2">
                <a
                  href="/doctor-signup"
                  className="text-blue-500 hover:underline"
                >
                  Ainda não tenho cadastro
                </a>
              </div>
              <div className="pt-4 flex justify-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (login) login();
                  }}
                  className="bg-[#D5A021] text-white rounded-md py-3 px-6 flex items-center justify-center gap-2"
                >
                  Fazer Login
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
