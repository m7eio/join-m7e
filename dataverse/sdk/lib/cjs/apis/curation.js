"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasCollections = exports.initCollections = exports.createDocIds = void 0;
const stream_tile_1 = require("@ceramicnetwork/stream-tile");
const constants_1 = require("../constants");
const enums_1 = require("../constants/enums");
async function createDocIds(idx, initIDSet) {
    if (!idx.authenticated) {
        throw new Error(`IDX is not authenticated`);
    }
    if (!initIDSet)
        initIDSet = [];
    const doc = await stream_tile_1.TileDocument.create(idx.ceramic, initIDSet, {
        schema: constants_1.schemas.DocIds,
        controllers: [idx.id],
        tags: ['DocIds'],
    });
    await idx._ceramic.pin.add(doc.id);
    return doc.id.toUrl();
}
exports.createDocIds = createDocIds;
// ###############################################
async function initCollections(idx, recipients) {
    const DID = idx._ceramic.did;
    if (!DID || !idx.authenticated) {
        throw new Error(`IDX is not authenticated`);
    }
    if (!recipients)
        recipients = [];
    recipients.push(idx.id);
    const secretDefault = await DID.createDagJWE({}, recipients);
    const [defaultPublic, defaultPrivate] = await Promise.all([
        { [enums_1.DefaultCollectionKeys.UNTITLED]: [await createDocIds(idx)] },
        { [enums_1.DefaultCollectionKeys.UNTITLED]: [await createDocIds(idx)] }
    ]);
    await idx.setAll({ [enums_1.IDXAliases.SECRETCOLLECTIONS]: secretDefault,
        [enums_1.IDXAliases.COLLECTIONS]: { public: defaultPublic, private: defaultPrivate }
    });
    return;
}
exports.initCollections = initCollections;
async function hasCollections(idx, did) {
    return (await idx.has(enums_1.IDXAliases.COLLECTIONS, did)) && (await idx.has(enums_1.IDXAliases.SECRETCOLLECTIONS, did));
}
exports.hasCollections = hasCollections;
