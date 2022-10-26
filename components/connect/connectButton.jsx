import { useState } from "react";
import { useWallet } from "@manahippo/aptos-wallet-adapter"
import { useDispatch } from "react-redux";
import { walletModalShow } from "../../redux/counterSlice";
const ConnectButton = (props) => {
    const { connectButton, disabled } = props
    const wallet = useWallet()
    const dispatch = useDispatch()
    const [showModal, setShowModal] = useState(false)
    const className = "dropdown-toggle text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5 w-full border rounded-2.5xl transition-shadow hover:shadow-lg h-full"
    function handleButtonClick() {
        if (connectButton) {
            dispatch(walletModalShow())
            return
        }
        wallet.disconnect()
    }
    const button = <button className={`${className} ${disabled}`} onClick={handleButtonClick} >
        <h4 className="mb-0">{connectButton ? "Connect Wallet" : "Disconnect"}</h4>
    </button>
    return (<>
        {connectButton ? button : wallet.account?.address?.toString() !== undefined ? <span className="mx-auto w-100">{button}</span> : null}
    </>);

};

export default ConnectButton;
