import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { walletModalhide } from "../../redux/counterSlice";

const ConnectWalletModal = () => {
  const walletModal = useSelector((state) => state.counter.walletModal);
  const dispatch = useDispatch();
  const wallet = useWallet();

  const handleSelectNetwork = async (adapter) => {
    await wallet.select(adapter.name);
    localStorage.setItem("currentNetwork", adapter.name);
    dispatch(walletModalhide());
  };

  useEffect(() => {
    const currentNetwork = localStorage.getItem("currentNetwork");
    if (currentNetwork) wallet.select(currentNetwork);
  }, []);

  return (
    <div>
      <div
        className={walletModal ? "block modal fade show " : "modal fade hidden"}
      >
        <div className="modal-dialog w-[600px]">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="walletModalLabel">
                Connect your wallet
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => dispatch(walletModalhide())}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="fill-jacarta-700 h-6 w-6 dark:fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
                </svg>
              </button>
            </div>
            <div className="modal-body text-left p-6">
              {wallet.wallets.map((walletType) => {
                const adapter = walletType.adapter;
                return (
                  <button
                    key={adapter.name}
                    className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 dark:hover:bg-accent hover:bg-accent text-jacarta-700 mb-4 flex w-full items-center justify-center rounded-full border-2 bg-white py-4 px-8 text-center font-semibold transition-all hover:border-transparent hover:text-white dark:text-white dark:hover:border-transparent"
                    onClick={() => handleSelectNetwork(adapter)}
                  >
                    <img
                      src={adapter.icon}
                      className="mr-2.5 inline-block h-6 w-6"
                    />
                    <span>{adapter.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletModal;
