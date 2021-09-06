import type { CeramicApi } from '@ceramicnetwork/common';
import type { IDX } from '@ceramicstudio/idx';
import { apis, BasicProfile } from 'dataverse-sdk';

let ceramic: CeramicApi;
let idx: IDX;

export async function initIDX() {
  ceramic = apis.threeId.createCeramic('https://dataverseceramicdaemon.com');
  idx = apis.threeId.createIDX(ceramic);
}

export function getDID(): string {
  return idx?.id;
}

export async function authenticateIDX(ethereumProvider: any, address: string): Promise<void> {
  const didProvider = await apis.threeId.createThreeIdFromEthereumProvider({
    threeIdConnectHost: 'https://app-clay.3idconnect.org',
    ethereumProvider,
    address,
  });

  await apis.threeId.authenticate({ ceramic, didProvider });
}

export async function initCollections(did?: string) {
  const isCollectionInit = await apis.curation.hasCollections(idx, did);
  if (!isCollectionInit) {
    await apis.curation.initCollections(idx);
  }
}

export async function setProfile(profile: BasicProfile) {
  return apis.threeId.setBasicProfile(idx, profile);
}

export async function setCryptoAccounts(address: string) {
  if (!(await apis.threeId.hasCryptoAccounts(idx))) {
    await apis.threeId.setCryptoAccounts(idx, address);
  }
}
