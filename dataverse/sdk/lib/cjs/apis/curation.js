"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToDefaultCollection = exports.getPublicCollections = exports.hasCollections = exports.initCollections = exports.loadUpdatableDoc = exports.createDocIds = exports.createNFTBookmark = void 0;
const stream_tile_1 = require("@ceramicnetwork/stream-tile");
const constants_1 = require("../constants");
const enums_1 = require("../constants/enums");
function createNFTBookmark(idx, bookmarkToAdd) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!idx.authenticated) {
            throw new Error(`IDX is not authenticated`);
        }
        const doc = yield stream_tile_1.TileDocument.create(idx.ceramic, bookmarkToAdd, {
            schema: constants_1.schemas.NFTBookmark,
            controllers: [idx.id],
            tags: ['NFTBookmarks'],
        });
        yield idx._ceramic.pin.add(doc.id);
        return doc.id.toUrl();
    });
}
exports.createNFTBookmark = createNFTBookmark;
function createDocIds(idx, initIDSet) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!idx.authenticated) {
            throw new Error(`IDX is not authenticated`);
        }
        if (!initIDSet)
            initIDSet = [];
        const doc = yield stream_tile_1.TileDocument.create(idx.ceramic, initIDSet, {
            schema: constants_1.schemas.DocIds,
            controllers: [idx.id],
            tags: ['DocIds'],
        });
        yield idx._ceramic.pin.add(doc.id);
        return doc.id.toUrl();
    });
}
exports.createDocIds = createDocIds;
function loadUpdatableDoc(idx, docID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!docID)
            return { doc: undefined, DocIds: [] };
        const doc = yield idx.ceramic.loadStream(docID);
        const DocIds = doc.content;
        return { doc, DocIds };
    });
}
exports.loadUpdatableDoc = loadUpdatableDoc;
// ###############################################
function initCollections(idx, recipients) {
    return __awaiter(this, void 0, void 0, function* () {
        console.time('initCollections');
        const DID = idx._ceramic.did;
        if (!DID || !idx.authenticated) {
            throw new Error(`IDX is not authenticated`);
        }
        if (!recipients)
            recipients = [];
        recipients.push(idx.id);
        const secretDefault = yield DID.createDagJWE({}, recipients);
        const emptyCollection = { [enums_1.DefaultCollectionKeys.UNTITLED]: [] };
        yield idx.setAll({
            [enums_1.IDXAliases.SECRETCOLLECTIONS]: secretDefault,
            [enums_1.IDXAliases.COLLECTIONS]: { public: emptyCollection, private: emptyCollection },
        });
        console.timeEnd('initCollections');
        return;
    });
}
exports.initCollections = initCollections;
function hasCollections(idx, did) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield idx.has(enums_1.IDXAliases.COLLECTIONS, did)) && (yield idx.has(enums_1.IDXAliases.SECRETCOLLECTIONS, did));
    });
}
exports.hasCollections = hasCollections;
function getPublicCollections(idx, did) {
    return __awaiter(this, void 0, void 0, function* () {
        const publicCollections = yield idx.get(enums_1.IDXAliases.COLLECTIONS, did);
        if (!publicCollections) {
            throw new Error(`Collections are not initialized in your metaverse`);
        }
        return publicCollections;
    });
}
exports.getPublicCollections = getPublicCollections;
// ###############################################
function saveToDefaultCollection(idx, bookmarkToAdd) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!idx.authenticated)
            throw new Error(`IDX is not authenticated`);
        let collections;
        let docId;
        [collections, docId] = yield Promise.all([
            yield getPublicCollections(idx),
            createNFTBookmark(idx, bookmarkToAdd)
        ]);
        const collectionForKey = collections.public['nft4metaverse'];
        if (!Array.isArray(collectionForKey) || !collectionForKey[0]) {
            const newPublic = Object.assign(Object.assign({}, collections.public), { 'nft4metaverse': [yield createDocIds(idx, [docId])] });
            const newPrivate = Object.assign(Object.assign({}, collections.private), { 'nft4metaverse': [] });
            const newCollections = { public: newPublic, private: newPrivate };
            yield idx.set(enums_1.IDXAliases.COLLECTIONS, newCollections);
        }
        else {
            const doc = yield loadUpdatableDoc(idx, collectionForKey[0]);
            doc.DocIds.push(docId);
            yield ((_a = doc.doc) === null || _a === void 0 ? void 0 : _a.update(doc.DocIds));
        }
        return docId;
    });
}
exports.saveToDefaultCollection = saveToDefaultCollection;
