var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DID } from 'dids';
import { IDX } from '@ceramicstudio/idx';
import { aliases } from '../constants';
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking';
import { Manager } from './manager';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import Ceramic from '@ceramicnetwork/http-client';
export function createCeramic(ceramicApiHost = process.env.CERAMIC_API_HOST) {
    const ceramic = new Ceramic(ceramicApiHost);
    return ceramic;
}
export function createIDX(ceramic) {
    const idx = new IDX({
        ceramic,
        aliases: Object.assign({}, aliases),
    });
    return idx;
}
export function createThreeIdFromManager({ ceramicApiHost, ethereumProvider, address, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const ceramic = new Ceramic(ceramicApiHost);
        const ethereumAuthProvider = new EthereumAuthProvider(ethereumProvider, address);
        const manager = new Manager(ethereumAuthProvider, { ceramic });
        const id = yield manager.createAccount();
        const didProvider = manager.didProvider(id);
        return didProvider;
    });
}
export function authenticate({ ceramic, didProvider, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const did = new DID({
            provider: didProvider,
            resolver: ThreeIdResolver.getResolver(ceramic),
        });
        yield ceramic.setDID(did);
        yield did.authenticate();
    });
}
export function setBasicProfile(idx, basicProfile) {
    return __awaiter(this, void 0, void 0, function* () {
        const docID = yield idx.set('basicProfile', basicProfile);
        return docID.toUrl();
    });
}
