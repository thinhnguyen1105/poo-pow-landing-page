import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { AptosClient } from "aptos";
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { toast } from 'react-toastify';
import cmHelper from "../../config/helper"
import { contract, collectionName, NODE_URL } from "../../config/constants"
import MintSuccessModal from '../modal/mintSuccessModal';
const aptosClient = new AptosClient(NODE_URL)
const autoCmRefresh = 10000;
const hero = () => {
  const wallet = useWallet();
  const [mintInfo, setMintInfo] = useState({ numToMint: 1, minting: false, success: false, mintedNfts: [] })
  const [isFetchignCmData, setIsFetchignCmData] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [Data, setData] = useState({ data: {}, fetch: fetchData })
  const mint = async () => {
    if (wallet.account?.address?.toString() === undefined || mintInfo.minting) return;
    console.log(wallet.account?.address?.toString());
    setMintInfo({ ...mintInfo, minting: true })
    // Generate a transaction
    const payload = {
      type: "entry_function_payload",
      function: "0xc071ef709539f7f9372f16050bf984fe6f11850594b8394f11bc74d22f48836b::candy_machine_v2::mint_tokens",
      type_arguments: [],
      arguments: [
        contract,
        collectionName,
        mintInfo.numToMint,
      ]
    };

    let txInfo;
    try {
      const txHash = await wallet.signAndSubmitTransaction(payload);
      console.log(txHash);
      txInfo = await aptosClient.waitForTransactionWithResult(txHash.hash)
    } catch (err) {
      txInfo = {
        success: false,
        vm_status: err.message,
      }
    }
    handleMintTxResult(txInfo)
    if (txInfo.success) setData({ ...Data, data: { ...Data.data, numMintedTokens: (parseInt(Data.data.numMintedTokens) + parseInt(mintInfo.numToMint)).toString() } })
    setShowModal(true)
  }
  async function handleMintTxResult(txInfo) {
    console.log(txInfo);
    const mintSuccess = txInfo.success;
    console.log(mintSuccess ? "Mint success!" : `Mint failure, an error occured.`)

    let mintedNfts = []
    if (!mintSuccess) {
      /// Handled error messages
      const handledErrorMessages = new Map([
        ["Failed to sign transaction", "An error occured while signing."],
        ["Move abort in 0x1::coin: EINSUFFICIENT_BALANCE(0x10006): Not enough coins to complete transaction", "Insufficient funds to mint."],
      ]);

      const txStatusError = txInfo.vm_status;
      console.error(`Mint not successful: ${txStatusError}`);
      let errorMessage = handledErrorMessages.get(txStatusError);
      errorMessage = errorMessage === undefined ? "Unkown error occured. Try again." : errorMessage;

      toast.error(errorMessage);
    } else {
      mintedNfts = await cmHelper.getMintedNfts(aptosClient, Data.data.tokenDataHandle, Data.data.contract, collectionName, txInfo)
      toast.success("Minting success!")
    }
    setMintInfo({ ...mintInfo, minting: false, success: mintSuccess, mintedNfts })
    console.log({ ...mintInfo, minting: false, success: mintSuccess, mintedNfts })
  }
  async function fetchData(indicateIsFetching = false) {
    console.log("Fetching candy machine data...")
    if (indicateIsFetching) setIsFetchignCmData(true)
    const cmResourceAccount = await cmHelper.getResourceAccount();
    if (cmResourceAccount === null) {
      setData({ ...Data, data: {} })
      setIsFetchignCmData(false)
      return
    }
    const collectionInfo = await cmHelper.getCollectionInfo(cmResourceAccount);
    const configData = await cmHelper.getConfigData(collectionInfo.ConfigHandle);
    setData({ ...Data, data: { cmResourceAccount, ...collectionInfo, ...configData } })
    setIsFetchignCmData(false)
  }
  useEffect(() => {
    fetchData(true)
    setInterval(fetchData, autoCmRefresh)
  }, [])
  return (
    <section className="relative pb-10 pt-20 md:pt-32 h-1527">
      <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10 block dark:hidden h-full">
        <img
          src="/images/gradient.jpg"
          alt="gradient"
          className="h-full w-full"
        />
      </picture>
      <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden dark:block">
        <img
          src="/images/gradient_dark.jpg"
          alt="gradient dark"
          className="h-full w-full"
        />
      </picture>

      <div className="container h-full mx-auto">
        <div className="grid h-full items-center gap-4 md:grid-cols-12">
          <div className="col-span-6 flex h-full flex-col items-center justify-center py-10 md:items-start md:py-20 xl:col-span-4">
            <h1 className="text-jacarta-700 font-bold font-display mb-6 text-center text-5xl dark:text-white md:text-left lg:text-6xl xl:text-7xl">
              Mint NFT, sell and collect NFTs.
            </h1>
            <p className="dark:text-jacarta-200 mb-8 text-center text-lg md:text-left">
              The worlds largest digital marketplace for crypto collectibles and
              non-fungible tokens
            </p>
            <div className="flex space-x-4">
              <button onClick={mint} className="bg-accent shadow-accent-volume hover:bg-accent-dark w-36 rounded-full py-3 px-8 text-center font-semibold text-white transition-all">
                Mint NFT
              </button>
              <MintSuccessModal show={showModal} data={{ numToMint: 1, minting: false, success: true, mintedNfts: [{ name: 'BTC Aptos Poo', imageUri: 'https://gateway.pinata.cloud/ipfs/QmPhLXcUy7HUnEaRg3Q3yjCkjuNLg2xA2giD75dzx7QsVK' }] }} onHide={() => { setShowModal(false) }} />
              <Link href="/collection/explore_collection">
                <a className="text-accent shadow-white-volume hover:bg-accent-dark hover:shadow-accent-volume w-36 rounded-full bg-white py-3 px-8 text-center font-semibold transition-all hover:text-white">
                  Explore
                </a>
              </Link>
            </div>
          </div>
          {/* <!-- Hero image --> */}
          <div className="col-span-6 xl:col-span-8">
            <div className="relative text-center md:pl-8 md:text-right">
              <img
                src="/images/products/team.png"
                alt=""
                className="hero-img mt-8 inline-block w-72 rotate-[8deg] sm:w-full lg:w-[24rem] xl:w-[35rem]"
              />
              <img
                src="/images/hero/3D_elements.png"
                alt=""
                className="animate-fly absolute top-0 md:-right-[10%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default hero;
