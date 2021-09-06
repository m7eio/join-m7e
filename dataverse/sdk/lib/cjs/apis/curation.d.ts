import { IDX } from '@ceramicstudio/idx';
export declare function createDocIds(idx: IDX, initIDSet?: string[]): Promise<string>;
export declare function initCollections(idx: IDX, recipients?: string[]): Promise<void>;
export declare function hasCollections(idx: IDX, did?: string): Promise<boolean>;
