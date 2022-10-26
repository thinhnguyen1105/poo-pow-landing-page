import { useState, useEffect } from "react";

const WalletMartian = () => {
  const [isMartian, setMartian] = useState(false);
  const [isConnected, setConnect] = useState(false);
  const [address, setAddress] = useState("");

  const btnConnect = async () => {
    await window.martian.connect();
    const isConnected = await window.martian.isConnected();
    setConnect(isConnected);
    if (isConnected) {
      const martianAccount = await window.martian.account();
      setAddress(martianAccount.address);
    }
  };

  useEffect(() => {
    if ("martian" in window) {
      setMartian(true);
      btnConnect();
    }
  }, []);

  return isMartian ? (
    !isConnected ? (
      <button
        onClick={btnConnect}
        className={
          "js-wallet border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          className={
            "fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white"
          }
        >
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path d="M22 6h-7a6 6 0 1 0 0 12h7v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2zm-7 2h8v8h-8a4 4 0 1 1 0-8zm0 3v2h3v-2h-3z"></path>
        </svg>
      </button>
    ) : (
      <div className="font-display flex flex-col justify-center mr-4 cursor-pointer">{`${address.slice(
        0,
        8
      )}...`}</div>
    )
  ) : (
    <div className="font-display flex flex-col justify-center mr-4 cursor-pointer"></div>
  );
};

export default WalletMartian;
