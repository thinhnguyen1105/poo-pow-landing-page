import axios from "axios";
import { contract, NFT_CONTRACT, collectionName, mode, NODE_URL, DECIMAL } from "./constants"
import { AptosClient } from "aptos";
const aptosClient = new AptosClient(NODE_URL)
const APTOS_COIN = "0x1::aptos_coin::AptosCoin";

async function getResourceAccount() {
    const response = await axios.get(`${NODE_URL}/accounts/${contract}/resources`);
    const resources = response.data;
    for (const resource of resources) {
        if (resource.type === `${NFT_CONTRACT}::candy_machine_v2::ResourceData`) {
            return resource.data.resource_account.account;
        }
    }

    console.error(`Candy machine not initialized on given address for chain ${mode}`);
    return null;
}

async function getCollectionInfo(
    resourceAccount
) {
    const response = await axios.get(`${NODE_URL}/accounts/${resourceAccount}/resources`);
    const resourceAccountResources = response.data;

    const collectionInfo = {}
    for (const resource of resourceAccountResources) {
        if (resource.type === "0x3::token::Collections") {
            collectionInfo.numUploadedTokens = resource.data.create_token_data_events.counter;
            collectionInfo.numMintedTokens = resource.data.mint_token_events.counter;
            collectionInfo.tokenDataHandle = resource.data.token_data.handle;
            continue;
        }
        if (resource.type === `${NFT_CONTRACT}::candy_machine_v2::CollectionConfigs`) {
            collectionInfo.ConfigHandle = resource.data.collection_configs.handle;
        }
    }

    return collectionInfo;
}

async function getConfigData(
    ConfigHandle
) {
    const data = JSON.stringify({
        "key_type": "vector<u8>",
        "value_type": `${NFT_CONTRACT}::candy_machine_v2::CollectionConfig`,
        "key": stringToHex(collectionName)
    });
    const customConfig = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const response = await axios.post(`${NODE_URL}/tables/${ConfigHandle}/item`, data, customConfig);
    const cmConfigData = response.data;

    const isPublic = cmConfigData.is_public;
    const maxMintsPerWallet = cmConfigData.max_supply_per_user;
    const mintFee = cmConfigData.mint_fee_per_mille / DECIMAL;
    const presaleMintTime = cmConfigData.presale_mint_time;
    const publicMintTime = cmConfigData.public_mint_time;

    return { isPublic, maxMintsPerWallet, mintFee, presaleMintTime, publicMintTime }
}

async function getMintedNfts(collectionTokenDataHandle, resourceAccount, collectionName, txInfo) {
    const mintedNfts = [];
    for (const event of txInfo.events) {
        if (event["type"] !== "0x3::token::MintTokenEvent") continue
        const mintedNft = {
            name: event["data"]["id"]["name"],
            imageUri: null
        }
        try {
            mintedNft.imageUri = (await aptosClient.getTableItem(collectionTokenDataHandle, {
                "key_type": "0x3::token::TokenDataId",
                "value_type": "0x3::token::TokenData",
                "key": {
                    "creator": resourceAccount,
                    "collection": collectionName,
                    "name": mintedNft.name
                }
            })).uri
        } catch (err) {
            console.error(err);
        }
        mintedNfts.push(mintedNft)
    }
    return mintedNfts
}

async function getBalance(address, extraArgs = null) {
    var _a;
    const coinType = (_a = extraArgs == null ? void 0 : extraArgs.coinType) != null ? _a : APTOS_COIN;
    const typeTag = `0x1::coin::CoinStore<${coinType}>`;
    let resources = await aptosClient.getAccountResources(address)
    const accountResource = resources.find((r) => r.type === typeTag);
    return accountResource.data.coin.value / DECIMAL;
}


function stringToHex(str) {
    var result = '';
    for (var i = 0; i < str.length; i++) {
        result += str.charCodeAt(i).toString(16);
    }
    return result;
}

export function getTimeDifference(current, next) {
    if (next < current) return "LIVE"
    var delta = Math.abs(next - current);

    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    var seconds = Math.floor(delta % 60);

    return { days, hours, minutes, seconds };
}

export function aptosWalletClient() {
    return aptosClient;
}

export default {
    getResourceAccount,
    getCollectionInfo,
    getConfigData,
    getTimeDifference,
    getMintedNfts,
    getBalance,
    aptosWalletClient
}