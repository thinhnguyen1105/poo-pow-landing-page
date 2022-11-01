export const contract = "0x00b1b6912ee100ed2b48894da4ea5976a28cfe3c1269ac9f08fc9e6efa78a5f5";
export const collectionName = "AptosPoo NFT - Dev #1";
export const collectionCoverUrl = "https://gateway.pinata.cloud/ipfs/QmQPiz3EoWYAmmL7ddzjEpgvKDLzbeXtXKskFMif2xDpxt"
export const mode = "dev"; // "dev" "test" "mainnet"
export const DECIMAL = 100000000
export const NFT_CONTRACT = "0x481efbf0c3cbec627b5f5674287d4ae6ee770da5949dcfe698a8520108236a33"
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