import type { DIDProvider } from 'dids';
import type { AuthProvider, LinkProof } from '@ceramicnetwork/blockchain-utils-linking';
import CeramicClient from '@ceramicnetwork/http-client';
import { IDX } from '@ceramicstudio/idx';
import ThreeIdProvider from '3id-did-provider';
export declare type AuthConfig = {
    authId: string;
    authSecret: Uint8Array;
};
export declare type SeedConfig = {
    v03ID?: string;
    seed: Uint8Array;
    did?: string;
};
export declare class Manager {
    authProvider: AuthProvider;
    idx: IDX;
    ceramic: CeramicClient;
    threeIdProviders: Record<string, ThreeIdProvider>;
    constructor(authprovider: AuthProvider, opts: {
        ceramic?: CeramicClient;
    });
    createAccount(): Promise<string>;
    _initIdentity(config: AuthConfig | SeedConfig): Promise<string>;
    _authCreate(): Promise<Uint8Array>;
    setDid(did: string): Promise<ThreeIdProvider>;
    _addLink(did: string, linkProof?: LinkProof | null): Promise<void>;
    didProvider(did: string): DIDProvider | undefined;
}
