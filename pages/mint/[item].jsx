import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { items_data } from "../../data/items_data";
import Auctions_dropdown from "../../components/dropdown/Auctions_dropdown";
import Link from "next/link";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import Items_Countdown_timer from "../../components/items_countdown_timer";
import { ItemsTabs } from "../../components/component";
import More_items from "./more_items";
import Likes from "../../components/likes";
import Meta from "../../components/Meta";
import { useDispatch } from "react-redux";
import { bidsModalShow } from "../../redux/counterSlice";
import { toast } from 'react-toastify';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import helper from "../../config/helper"
import { collectionName, NFT_CONTRACT, contract } from "../../config/constants"
const Item = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pid = router.query.item;
  const autoRefeshTimer = 10000
  const wallet = useWallet();
  const [imageModal, setImageModal] = useState(false);
  const [isMintSuccess, setMintSuccess] = useState(false)
  const [isFetchignCmData, setIsFetchignCmData] = useState(false)
  const [cmData, setCmData] = useState({ data: {}, fetch: fetchData })
  const [timeLeftToMint, setTimeLeftToMint] = useState({ presale: "", public: "", timeout: null })
  const [mintInfo, setMintInfo] = useState({ numToMint: 1, minting: false, success: false, mintedNfts: [] })
  const [canMint, setCanMint] = useState(false)
  const mint = async () => {
    if (wallet.account?.address?.toString() === undefined || mintInfo.minting) return;

    console.log(wallet.account?.address?.toString());
    setMintInfo({ ...mintInfo, minting: true })
    // Generate a transaction
    const payload = {
      type: "entry_function_payload",
      function: `${NFT_CONTRACT}::candy_machine_v2::mint_tokens`,
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
      txInfo = await helper.aptosWalletClient().waitForTransactionWithResult(txHash.hash)
    } catch (err) {
      txInfo = {
        success: false,
        vm_status: err.message,
      }
    }
    handleMintTxResult(txInfo)
    if (txInfo.success) setCmData({ ...cmData, data: { ...cmData.data, numMintedTokens: (parseInt(cmData.data.numMintedTokens) + parseInt(mintInfo.numToMint)).toString() } })
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
      mintedNfts = await helper.getMintedNfts(cmData.data.tokenDataHandle, cmData.data.resourceAccount, collectionName, txInfo)
      toast.success("Minting success!")
      setMintSuccess(true)
    }

    console.log(JSON.stringify({ ...mintInfo, minting: false, success: mintSuccess, mintedNfts }))
    setMintInfo({ ...mintInfo, minting: false, success: mintSuccess, mintedNfts })
  }

  function verifyTimeLeftToMint() {
    const mintTimersTimeout = setTimeout(verifyTimeLeftToMint, 1000)
    if (cmData.data.presaleMintTime === undefined || cmData.data.publicMintTime === undefined) return

    const currentTime = Math.round(new Date().getTime() / 1000);
    setTimeLeftToMint({ timeout: mintTimersTimeout, presale: helper.getTimeDifference(currentTime, cmData.data.presaleMintTime), public: helper.getTimeDifference(currentTime, cmData.data.publicMintTime) })
  }

  async function fetchData(indicateIsFetching = false) {
    const resourceAccount = await helper.getResourceAccount();
    if (resourceAccount === null) {
      setCmData({ ...cmData, data: {} })
      setIsFetchignCmData(false)
      return
    }
    const collectionInfo = await helper.getCollectionInfo(resourceAccount);
    const configData = await helper.getConfigData(collectionInfo.ConfigHandle);
    setCmData({ ...cmData, data: { resourceAccount, ...collectionInfo, ...configData } })
    setIsFetchignCmData(false)
  }

  useEffect(() => {
    fetchData(true)
    setInterval(fetchData, autoRefeshTimer)
  }, [])

  useEffect(() => {
    clearTimeout(timeLeftToMint.timeout)
    verifyTimeLeftToMint()
  }, [cmData])

  useEffect(() => {
    setCanMint(wallet.connected && cmData.data.isPublic && parseInt(cmData.data.numUploadedTokens) > parseInt(cmData.data.numMintedTokens) && timeLeftToMint.presale === "LIVE")
  }, [wallet, cmData, timeLeftToMint])

  return (
    <>
      <Meta title={`Mint NFT | PooAptos`} />
      {/*  <!-- Item --> */}
      <section className="relative lg:mt-24 lg:pt-24 lg:pb-24 mt-24 pt-12 pb-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <img
            src="/images/gradient_light.jpg"
            alt="gradient"
            className="h-full"
          />
        </picture>
        <div className="container">
          {/* <!-- Item --> */}
          {items_data
            .filter((item) => item.id === pid)
            .map((item) => {
              const {
                image,
                title,
                id,
                likes,
                text,
                creatorImage,
                ownerImage,
                creatorname,
                ownerName,
                price,
                auction_timer,
              } = item;

              return (
                <div className="md:flex md:flex-wrap" key={id}>
                  {/* <!-- Image --> */}
                  <figure className="mb-8 md:w-2/5 md:flex-shrink-0 md:flex-grow-0 md:basis-auto lg:w-1/2 w-full">
                    <button
                      className=" w-full"
                      onClick={() => setImageModal(true)}
                    >
                      <img
                        src={image}
                        alt={title}
                        className="rounded-2xl cursor-pointer  w-full"
                      />
                    </button>

                    {/* <!-- Modal --> */}
                    <div
                      className={
                        imageModal ? "modal fade show block" : "modal fade"
                      }
                    >
                      <div className="modal-dialog !my-0 flex h-full max-w-4xl items-center justify-center">
                        <img
                          src={image}
                          alt={title}
                          className="h-full rounded-2xl"
                        />
                      </div>

                      <button
                        type="button"
                        className="btn-close absolute top-6 right-6"
                        onClick={() => setImageModal(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="h-6 w-6 fill-white"
                        >
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
                        </svg>
                      </button>
                    </div>
                    {/* <!-- end modal --> */}

                    {/* <!-- Modal Mint --> */}
                    <div
                      className={
                        isMintSuccess ? "modal fade show block" : "modal fade"
                      }
                    >
                      <div className="modal-dialog max-w-2xl">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="placeBidLabel">
                              Your NFT
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              onClick={() => setMintSuccess(false)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                className="fill-jacarta-700 h-6 w-6 dark:fill-white"
                              >
                                <path fill="none" d="M0 0h24v24H0z"></path>
                                <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
                              </svg>
                            </button>
                          </div>
                          <div className="modal-body p-6">
                            {mintInfo.mintedNfts.map(mintedNft => <div key={mintedNft.name} className="relative col-span-6 xl:col-span-6 xl:col-start-7">
                              <img
                                src={mintedNft.imageUri === null ? "" : mintedNft.imageUri}
                                className="h-full rounded-2xl"
                              />
                              <h1 className="font-display text-jacarta-700 text-4xl font-semibold dark:text-white mt-2">
                                {mintedNft.name}
                              </h1>
                            </div>)}
                          </div>
                        </div>
                      </div>

                    </div>
                    {/* <!-- end modal mint --> */}
                  </figure>

                  {/* <!-- Details --> */}
                  <div className="md:w-3/5 md:basis-auto md:pl-8 lg:w-1/2 lg:pl-[3.75rem]">
                    {/* <!-- Collection / Likes / Actions --> */}
                    <div className="mb-3 flex">
                      {/* <!-- Collection --> */}
                      <div className="flex items-center">
                        <Link href="#">
                          <a className="text-accent mr-2 text-sm font-bold">
                            {collectionName}
                          </a>
                        </Link>
                        <span
                          className="dark:border-jacarta-600 bg-green inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
                          data-tippy-content="Verified Collection"
                        >
                          <Tippy content={<span>Verified Collection</span>}>
                            <svg className="icon h-[.875rem] w-[.875rem] fill-white">
                              <use xlinkHref="/icons.svg#icon-right-sign"></use>
                            </svg>
                          </Tippy>
                        </span>
                      </div>

                      {/* <!-- Likes / Actions --> */}
                      <div className="ml-auto flex items-stretch space-x-2 relative">
                        <Likes
                          like={likes}
                          classes="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 flex items-center space-x-1 rounded-xl border bg-white py-2 px-4"
                        />

                        {/* <!-- Actions --> */}
                        <Auctions_dropdown classes="dark:border-jacarta-600 dark:hover:bg-jacarta-600 border-jacarta-100 dropdown hover:bg-jacarta-100 dark:bg-jacarta-700 rounded-xl border bg-white" />
                      </div>
                    </div>
                    <div className="flex items-center mb-4">
                      <h1 className="font-display text-jacarta-700 text-4xl font-semibold dark:text-white">
                        {collectionName}{" "}
                      </h1>
                      {/* <img
                        className="mx-2"
                        src="/images/chains/logo-apt.png"
                        width={30}
                      ></img>
                      <h1 className="text-green font-display text-4xl font-semibold dark:text-white">
                        1 APT
                      </h1> */}
                    </div>

                    <div className="mb-8 flex items-center space-x-4 whitespace-nowrap">
                      <span className="dark:text-jacarta-300 text-jacarta-400 text-sm">
                        Mint Price
                      </span>
                      <div className="flex items-center">
                        <span className="text-green text-sm font-medium tracking-tight">
                          {cmData.data.mintFee} APT
                        </span>
                      </div>
                      <span className="dark:text-jacarta-300 text-jacarta-400 text-sm">
                        {cmData.data.numMintedTokens} / {cmData.data.numUploadedTokens} minted
                      </span>
                    </div>

                    <p className="dark:text-jacarta-300 mb-10">{text}</p>

                    {/* <!-- Creator / Owner --> */}
                    <div className="mb-8 flex flex-wrap">
                      <div className="mr-8 mb-4 flex">
                        <figure className="mr-4 shrink-0">
                          <Link href="/user/avatar_6">
                            <a className="relative block">
                              <img
                                src={creatorImage}
                                alt={creatorname}
                                className="rounded-2lg h-12 w-12"
                                loading="lazy"
                              />
                              <div
                                className="dark:border-jacarta-600 bg-green absolute -right-3 top-[60%] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
                                data-tippy-content="Verified Collection"
                              >
                                <Tippy
                                  content={<span>Verified Collection</span>}
                                >
                                  <svg className="icon h-[.875rem] w-[.875rem] fill-white">
                                    <use xlinkHref="/icons.svg#icon-right-sign"></use>
                                  </svg>
                                </Tippy>
                              </div>
                            </a>
                          </Link>
                        </figure>
                        <div className="flex flex-col justify-center">
                          <span className="text-jacarta-400 block text-sm dark:text-white">
                            Creator <strong>100% royalties</strong>
                          </span>
                          <Link href="/user/avatar_6">
                            <a className="text-accent block">
                              <span className="text-sm font-bold">
                                {creatorname}
                              </span>
                            </a>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* <!-- Bid --> */}
                    <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white p-8">
                      <div className="mb-8 sm:flex sm:flex-wrap">
                        {/* <!-- Countdown --> */}
                        <div className=" mt-4 sm:mt-0 sm:w-1/2 sm:pl-4 lg:pl-4">
                          <span className="js-countdown-ends-label text-jacarta-400 dark:text-jacarta-300 text-sm">
                            Presale:
                          </span>
                          <h6>{timeLeftToMint.presale === "LIVE" ? "LIVE" : timeLeftToMint.presale.days + " days : " + timeLeftToMint.presale.hours + " hours : " + timeLeftToMint.presale.minutes + " minutes : " + timeLeftToMint.presale.seconds + " seconds"}</h6>
                          <span className="js-countdown-ends-label text-jacarta-400 dark:text-jacarta-300 text-sm">Public In:</span>
                          <h6>{timeLeftToMint.public === "LIVE" ? "LIVE" : timeLeftToMint.public.days + " days : " + timeLeftToMint.public.hours + " hours : " + timeLeftToMint.public.minutes + " minutes : " + timeLeftToMint.public.seconds + " seconds"}</h6>
                          {/*
                          <Items_Countdown_timer time={+auction_timer} /> 
                          */}
                        </div>
                      </div>

                      <Link href="#">
                        <button
                          className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                          // onClick={() => dispatch(bidsModalShow())}
                          onClick={() => mint()}
                        >
                          Mint NFT
                        </button>
                      </Link>
                    </div>
                    {/* <!-- end bid --> */}
                  </div>
                  {/* <!-- end details --> */}
                </div>
              );
            })}
          <ItemsTabs />
        </div>
      </section>
      {/* <!-- end item --> */}

      <More_items />
    </>
  );
};

export default Item;
