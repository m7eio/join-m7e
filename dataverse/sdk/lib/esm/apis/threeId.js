import { IDX } from '@ceramicstudio/idx';
import { aliases } from '../constants';
import { DID } from 'dids';
import { EthereumAuthProvider, ThreeIdConnect } from '@3id/connect';
import Ceremic from '@ceramicnetwork/http-client';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
export function createCeramic(ceramicApiHost = process.env.CERAMIC_API_HOST) {
    const ceramic = new Ceremic(ceramicApiHost);
    return ceramic;
}
export function createIDX(ceramic) {
    const idx = new IDX({
        ceramic,
        aliases: { ...aliases },
    });
    return idx;
}
export async function createThreeIdFromEthereumProvider({ threeIdConnectHost, ethereumProvider, address, }) {
    const ethereumAuthProvider = new EthereumAuthProvider(ethereumProvider, address);
    const threeIdConnect = new ThreeIdConnect(threeIdConnectHost);
    await threeIdConnect.connect(ethereumAuthProvider);
    const didProvider = threeIdConnect.getDidProvider();
    return didProvider;
}
export async function authenticate({ ceramic, didProvider, }) {
    const did = new DID({
        provider: didProvider,
        resolver: ThreeIdResolver.getResolver(ceramic),
    });
    await ceramic.setDID(did);
    await did.authenticate();
}
export async function setBasicProfile(idx, basicProfile) {
    const docID = await idx.set('basicProfile', basicProfile);
    return docID.toUrl();
}
export async function hasCryptoAccounts(idx, did) {
    return idx.has('cryptoAccounts', did);
}
export async function setCryptoAccounts(idx, address) {
    if (!idx.authenticated) {
        throw new Error(`IDX is not authenticated`);
    }
    const accoundId = `${address}@eip155:1`;
    const links = { [accoundId]: 'ceramic://00' };
    return idx.set('cryptoAccounts', links);
}
