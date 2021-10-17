"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBasicProfile = exports.authenticate = exports.createThreeIdFromManager = exports.createIDX = exports.createCeramic = void 0;
const dids_1 = require("dids");
const idx_1 = require("@ceramicstudio/idx");
const constants_1 = require("../constants");
const blockchain_utils_linking_1 = require("@ceramicnetwork/blockchain-utils-linking");
const manager_1 = require("./manager");
const _3id_did_resolver_1 = __importDefault(require("@ceramicnetwork/3id-did-resolver"));
const http_client_1 = __importDefault(require("@ceramicnetwork/http-client"));
function createCeramic(ceramicApiHost = process.env.CERAMIC_API_HOST) {
    const ceramic = new http_client_1.default(ceramicApiHost);
    return ceramic;
}
exports.createCeramic = createCeramic;
function createIDX(ceramic) {
    const idx = new idx_1.IDX({
        ceramic,
        aliases: Object.assign({}, constants_1.aliases),
    });
    return idx;
}
exports.createIDX = createIDX;
function createThreeIdFromManager({ ceramicApiHost, ethereumProvider, address, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const ceramic = new http_client_1.default(ceramicApiHost);
        const ethereumAuthProvider = new blockchain_utils_linking_1.EthereumAuthProvider(ethereumProvider, address);
        const manager = new manager_1.Manager(ethereumAuthProvider, { ceramic });
        const id = yield manager.createAccount();
        const didProvider = manager.didProvider(id);
        return didProvider;
    });
}
exports.createThreeIdFromManager = createThreeIdFromManager;
function authenticate({ ceramic, didProvider, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const did = new dids_1.DID({
            provider: didProvider,
            resolver: _3id_did_resolver_1.default.getResolver(ceramic),
        });
        yield ceramic.setDID(did);
        yield did.authenticate();
    });
}
exports.authenticate = authenticate;
function setBasicProfile(idx, basicProfile) {
    return __awaiter(this, void 0, void 0, function* () {
        const docID = yield idx.set('basicProfile', basicProfile);
        return docID.toUrl();
    });
}
exports.setBasicProfile = setBasicProfile;
