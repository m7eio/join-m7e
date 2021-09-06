import { TileDocument } from '@ceramicnetwork/stream-tile';
import { schemas } from '../constants';
import { DefaultCollectionKeys, IDXAliases } from '../constants/enums';
export async function createDocIds(idx, initIDSet) {
    if (!idx.authenticated) {
        throw new Error(`IDX is not authenticated`);
    }
    if (!initIDSet)
        initIDSet = [];
    const doc = await TileDocument.create(idx.ceramic, initIDSet, {
        schema: schemas.DocIds,
        controllers: [idx.id],
        tags: ['DocIds'],
    });
    await idx._ceramic.pin.add(doc.id);
    return doc.id.toUrl();
}
// ###############################################
export async function initCollections(idx, recipients) {
    const DID = idx._ceramic.did;
    if (!DID || !idx.authenticated) {
        throw new Error(`IDX is not authenticated`);
    }
    if (!recipients)
        recipients = [];
    recipients.push(idx.id);
    const secretDefault = await DID.createDagJWE({}, recipients);
    const [defaultPublic, defaultPrivate] = await Promise.all([
        { [DefaultCollectionKeys.UNTITLED]: [await createDocIds(idx)] },
        { [DefaultCollectionKeys.UNTITLED]: [await createDocIds(idx)] }
    ]);
    await idx.setAll({ [IDXAliases.SECRETCOLLECTIONS]: secretDefault,
        [IDXAliases.COLLECTIONS]: { public: defaultPublic, private: defaultPrivate }
    });
    return;
}
export async function hasCollections(idx, did) {
    return (await idx.has(IDXAliases.COLLECTIONS, did)) && (await idx.has(IDXAliases.SECRETCOLLECTIONS, did));
}
