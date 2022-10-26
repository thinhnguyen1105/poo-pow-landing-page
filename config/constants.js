export const contract = "0xc67e0fd7e4a6655e7f0ae2ccaab1d8c53500ccfd9c1caec5ffdfeee9753c47fd";
export const collectionName = "AptosPoo NFT";
export const collectionCoverUrl = "https://cloudflare-ipfs.com/ipfs/QmVsudH4sHELLHfaw3mYsX55zMXa2vpPAEvPsdPAV9Kwfx"
export const mode = "dev"; // "dev" "test" "mainnet"

export let NODE_URL;
let FAUCET_URL;
if (mode == "dev") {
    NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";
    FAUCET_URL = "https://faucet.devnet.aptoslabs.com";
} else if (mode === "test") {
    NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
    FAUCET_URL = "https://faucet.testnet.aptoslabs.com";
} else {
    NODE_URL = "https://fullnode.mainnet.aptoslabs.com/v1";
    FAUCET_URL = null;
}