import { TileDocument } from '@ceramicnetwork/stream-tile';
import { IDX } from '@ceramicstudio/idx';
import { PublicCollections, NFTBookmark } from '../models';
export declare function createNFTBookmark(idx: IDX, bookmarkToAdd: NFTBookmark): Promise<string>;
export declare function createDocIds(idx: IDX, initIDSet?: string[]): Promise<string>;
export declare function loadUpdatableDoc(idx: IDX, docID: string): Promise<{
    doc: TileDocument<Record<string, any>> | undefined;
    DocIds: string[];
}>;
export declare function initCollections(idx: IDX, recipients?: string[]): Promise<void>;
export declare function hasCollections(idx: IDX, did?: string): Promise<boolean>;
export declare function getPublicCollections(idx: IDX, did?: string): Promise<PublicCollections>;
export declare function saveToDefaultCollection(idx: IDX, bookmarkToAdd: NFTBookmark): Promise<string>;
