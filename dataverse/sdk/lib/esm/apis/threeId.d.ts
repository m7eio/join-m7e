import { IDX } from '@ceramicstudio/idx';
import { BasicProfile } from '../models';
import type { CeramicApi } from '@ceramicnetwork/common';
export declare function createCeramic(ceramicApiHost?: string | undefined): CeramicApi;
export declare function createIDX(ceramic: CeramicApi): IDX;
export declare function createThreeIdFromEthereumProvider({ threeIdConnectHost, ethereumProvider, address, }: {
    threeIdConnectHost?: string;
    ethereumProvider: any;
    address: string;
}): Promise<import("@3id/connect").DidProviderProxy>;
export declare function authenticate({ ceramic, didProvider, }: {
    ceramic: CeramicApi;
    didProvider: any;
}): Promise<void>;
export declare function setBasicProfile(idx: IDX, basicProfile: BasicProfile): Promise<string>;
export declare function hasCryptoAccounts(idx: IDX, did?: string): Promise<boolean>;
export declare function setCryptoAccounts(idx: IDX, address: string): Promise<import("@ceramicnetwork/streamid").StreamID>;
