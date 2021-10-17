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
exports.Manager = void 0;
const common_1 = require("@3id/common");
const dids_1 = require("dids");
const http_client_1 = __importDefault(require("@ceramicnetwork/http-client"));
const idx_1 = require("@ceramicstudio/idx");
const sha256_1 = require("@stablelib/sha256");
const _3id_did_provider_1 = __importDefault(require("3id-did-provider"));
const uint8arrays_1 = require("uint8arrays");
const key_did_resolver_1 = __importDefault(require("key-did-resolver"));
const _3id_did_resolver_1 = __importDefault(require("@ceramicnetwork/3id-did-resolver"));
const did_resolver_1 = require("did-resolver");
const stream_caip10_link_1 = require("@ceramicnetwork/stream-caip10-link");
let CERAMIC_API = 'https://ceramic-clay.3boxlabs.com';
class Manager {
    // needs work on wording for "account", did, caip10 etc
    constructor(authprovider, opts) {
        this.authProvider = authprovider;
        this.ceramic = opts.ceramic || new http_client_1.default(CERAMIC_API);
        this.idx = new idx_1.IDX({ ceramic: this.ceramic });
        this.threeIdProviders = {};
    }
    // Create DID
    createAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = (yield this.authProvider.accountId()).toString();
            if (this.threeIdProviders[accountId])
                return this.threeIdProviders[accountId].id;
            const authSecret = yield this._authCreate();
            const configId = { authSecret, authId: accountId };
            common_1.assert.isDefined(configId, 'Identity Config to initialize identity');
            const did = yield this._initIdentity(configId);
            yield this._addLink(did);
            return did;
        });
    }
    _initIdentity(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const getPermission = () => Promise.resolve([]);
            const threeIdConfig = Object.assign(config, {
                getPermission,
                ceramic: this.ceramic,
            });
            const threeId = yield _3id_did_provider_1.default.create(threeIdConfig);
            this.threeIdProviders[threeId.id] = threeId;
            return threeId.id;
        });
    }
    _authCreate() {
        return __awaiter(this, void 0, void 0, function* () {
            const message = 'Allow this account to control your identity';
            const authSecret = yield this.authProvider.authenticate(message);
            const entropy = sha256_1.hash(uint8arrays_1.fromString(authSecret.slice(2)));
            return entropy;
        });
    }
    setDid(did) {
        return __awaiter(this, void 0, void 0, function* () {
            const didProvider = this.threeIdProviders[did].getDidProvider();
            const keyDidResolver = key_did_resolver_1.default.getResolver();
            const threeIdResolver = _3id_did_resolver_1.default.getResolver(this.ceramic);
            const resolver = new did_resolver_1.Resolver(Object.assign(Object.assign({}, threeIdResolver), keyDidResolver));
            const didInstance = new dids_1.DID({ provider: didProvider, resolver: resolver });
            yield didInstance.authenticate();
            yield this.ceramic.setDID(didInstance);
            return this.threeIdProviders[did];
        });
    }
    // internal for now, until auth/link not strictly required together
    _addLink(did, linkProof) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = yield this.authProvider.accountId();
            yield this.setDid(did);
            const existing = (yield this.idx.get('cryptoAccounts')) || {};
            if (existing && existing[accountId.toString()])
                return;
            if (!linkProof) {
                linkProof = yield this.authProvider.createLink(did);
            }
            const accountLink = yield stream_caip10_link_1.Caip10Link.fromAccount(this.ceramic, accountId, {
                anchor: false,
                publish: false,
            });
            yield accountLink.setDidProof(linkProof);
            yield this.ceramic.pin.add(accountLink.id);
            const links = Object.assign(existing, { [accountId.toString()]: accountLink.id.toUrl() });
            yield this.idx.set('cryptoAccounts', links);
        });
    }
    didProvider(did) {
        var _a;
        return (_a = this.threeIdProviders[did]) === null || _a === void 0 ? void 0 : _a.getDidProvider();
    }
}
exports.Manager = Manager;
