import { CeramicDoc } from '../typings';
export declare class NFTBookmark {
    chain: string;
    contract: string;
    tokenId: string;
    url: string;
    note: string;
    tags: string[];
    date: string;
}
export declare type NFTBookmarkDoc = CeramicDoc<NFTBookmark>;
