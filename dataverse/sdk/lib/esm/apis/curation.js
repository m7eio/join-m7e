var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TileDocument } from '@ceramicnetwork/stream-tile';
import { schemas } from '../constants';
import { DefaultCollectionKeys, IDXAliases } from '../constants/enums';
export function createNFTBookmark(idx, bookmarkToAdd) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!idx.authenticated) {
            throw new Error(`IDX is not authenticated`);
        }
        const doc = yield TileDocument.create(idx.ceramic, bookmarkToAdd, {
            schema: schemas.NFTBookmark,
            controllers: [idx.id],
            tags: ['NFTBookmarks'],
        });
        yield idx._ceramic.pin.add(doc.id);
        return doc.id.toUrl();
    });
}
export function createDocIds(idx, initIDSet) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!idx.authenticated) {
            throw new Error(`IDX is not authenticated`);
        }
        if (!initIDSet)
            initIDSet = [];
        const doc = yield TileDocument.create(idx.ceramic, initIDSet, {
            schema: schemas.DocIds,
            controllers: [idx.id],
            tags: ['DocIds'],
        });
        yield idx._ceramic.pin.add(doc.id);
        return doc.id.toUrl();
    });
}
export function loadUpdatableDoc(idx, docID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!docID)
            return { doc: undefined, DocIds: [] };
        const doc = yield idx.ceramic.loadStream(docID);
        const DocIds = doc.content;
        return { doc, DocIds };
    });
}
// ###############################################
export function initCollections(idx, recipients) {
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
        const emptyCollection = { [DefaultCollectionKeys.UNTITLED]: [] };
        yield idx.setAll({
            [IDXAliases.SECRETCOLLECTIONS]: secretDefault,
            [IDXAliases.COLLECTIONS]: { public: emptyCollection, private: emptyCollection },
        });
        console.timeEnd('initCollections');
        return;
    });
}
export function hasCollections(idx, did) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield idx.has(IDXAliases.COLLECTIONS, did)) && (yield idx.has(IDXAliases.SECRETCOLLECTIONS, did));
    });
}
export function getPublicCollections(idx, did) {
    return __awaiter(this, void 0, void 0, function* () {
        const publicCollections = yield idx.get(IDXAliases.COLLECTIONS, did);
        if (!publicCollections) {
            throw new Error(`Collections are not initialized in your metaverse`);
        }
        return publicCollections;
    });
}
// ###############################################
export function saveToDefaultCollection(idx, bookmarkToAdd) {
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
            yield idx.set(IDXAliases.COLLECTIONS, newCollections);
        }
        else {
            const doc = yield loadUpdatableDoc(idx, collectionForKey[0]);
            doc.DocIds.push(docId);
            yield ((_a = doc.doc) === null || _a === void 0 ? void 0 : _a.update(doc.DocIds));
        }
        return docId;
    });
}
