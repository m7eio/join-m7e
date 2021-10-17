import { DID } from 'dids';
import { EthereumAuthProvider } from '@3id/connect';
import type { CeramicApi } from '@ceramicnetwork/common';
import Ceramic from '@ceramicnetwork/http-client';

import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';

import { Manager } from './manager';

export async function createThreeIdFromManager({
  ceramicApiHost,
  ethereumProvider,
  address,
}: {
  ceramicApiHost: string | undefined;
  ethereumProvider: any;
  address: string;
}) {
  const ceramic = new Ceramic(ceramicApiHost);
  const ethereumAuthProvider = new EthereumAuthProvider(ethereumProvider, address);
  
  const manager = new Manager(ethereumAuthProvider, { ceramic });
  const id = await manager.createAccount();

  const didProvider = manager.didProvider(id);

  return didProvider;
}

export async function authenticate({
  ceramic,
  didProvider,
}: {
  ceramic: CeramicApi;
  didProvider: any;
}) {
  const did = new DID({
    provider: didProvider,
    resolver: ThreeIdResolver.getResolver(ceramic),
  });
  await ceramic.setDID(did);
  await did.authenticate();
}

