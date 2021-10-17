import { IDX } from '@ceramicstudio/idx';
import type { CeramicApi } from '@ceramicnetwork/common';
import { BasicProfile } from '../models';
export declare function createCeramic(ceramicApiHost?: string | undefined): CeramicApi;
export declare function createIDX(ceramic: CeramicApi): IDX;
export declare function createThreeIdFromManager({ ceramicApiHost, ethereumProvider, address, }: {
    ceramicApiHost: string | undefined;
    ethereumProvider: any;
    address: string;
}): Promise<import("dids").DIDProvider | undefined>;
export declare function authenticate({ ceramic, didProvider, }: {
    ceramic: CeramicApi;
    didProvider: any;
}): Promise<void>;
export declare function setBasicProfile(idx: IDX, basicProfile: BasicProfile): Promise<string>;
