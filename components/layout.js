import Navbar from "./navbar";
import Footer from "./footer";
import ConnectWalletModal from "./modal/connectWalletModal"
import BidsModal from "./modal/bidsModal";
import BuyModal from "./modal/buyModal";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <BidsModal />
      <BuyModal />
      <main>{children}</main>
      <Footer />
      <ConnectWalletModal />
    </>
  );
}
