"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCryptoAccounts = exports.hasCryptoAccounts = exports.setBasicProfile = exports.authenticate = exports.createThreeIdFromEthereumProvider = exports.createIDX = exports.createCeramic = void 0;
const idx_1 = require("@ceramicstudio/idx");
const constants_1 = require("../constants");
const dids_1 = require("dids");
const connect_1 = require("@3id/connect");
const http_client_1 = __importDefault(require("@ceramicnetwork/http-client"));
const _3id_did_resolver_1 = __importDefault(require("@ceramicnetwork/3id-did-resolver"));
function createCeramic(ceramicApiHost = process.env.CERAMIC_API_HOST) {
    const ceramic = new http_client_1.default(ceramicApiHost);
    return ceramic;
}
exports.createCeramic = createCeramic;
function createIDX(ceramic) {
    const idx = new idx_1.IDX({
        ceramic,
        aliases: { ...constants_1.aliases },
    });
    return idx;
}
exports.createIDX = createIDX;
async function createThreeIdFromEthereumProvider({ threeIdConnectHost, ethereumProvider, address, }) {
    const ethereumAuthProvider = new connect_1.EthereumAuthProvider(ethereumProvider, address);
    const threeIdConnect = new connect_1.ThreeIdConnect(threeIdConnectHost);
    await threeIdConnect.connect(ethereumAuthProvider);
    const didProvider = threeIdConnect.getDidProvider();
    return didProvider;
}
exports.createThreeIdFromEthereumProvider = createThreeIdFromEthereumProvider;
async function authenticate({ ceramic, didProvider, }) {
    const did = new dids_1.DID({
        provider: didProvider,
        resolver: _3id_did_resolver_1.default.getResolver(ceramic),
    });
    await ceramic.setDID(did);
    await did.authenticate();
}
exports.authenticate = authenticate;
async function setBasicProfile(idx, basicProfile) {
    const docID = await idx.set('basicProfile', basicProfile);
    return docID.toUrl();
}
exports.setBasicProfile = setBasicProfile;
async function hasCryptoAccounts(idx, did) {
    return idx.has('cryptoAccounts', did);
}
exports.hasCryptoAccounts = hasCryptoAccounts;
async function setCryptoAccounts(idx, address) {
    if (!idx.authenticated) {
        throw new Error(`IDX is not authenticated`);
    }
    const accoundId = `${address}@eip155:1`;
    const links = { [accoundId]: 'ceramic://00' };
    return idx.set('cryptoAccounts', links);
}
exports.setCryptoAccounts = setCryptoAccounts;
