"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALIASES = void 0;
const definitions_1 = require("./definitions");
const enums_1 = require("./enums");
exports.ALIASES = {
    [enums_1.IDXAliases.COLLECTIONS]: definitions_1.PUBLISHED_DEFINITIONS.Collections,
    [enums_1.IDXAliases.SECRETCOLLECTIONS]: definitions_1.PUBLISHED_DEFINITIONS.secretCollections
};
