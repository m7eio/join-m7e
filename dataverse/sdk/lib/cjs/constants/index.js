"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enums = exports.aliases = exports.schemas = exports.definitions = void 0;
const idxConstants = __importStar(require("@ceramicstudio/idx-constants"));
const definitions_1 = require("./definitions");
const schemas_1 = require("./schemas");
const aliases_1 = require("./aliases");
exports.definitions = Object.assign(Object.assign({}, idxConstants.definitions), definitions_1.PUBLISHED_DEFINITIONS);
exports.schemas = Object.assign(Object.assign({}, idxConstants.schemas), schemas_1.PUBLISHED_SCHEMAS);
exports.aliases = Object.assign(Object.assign({}, idxConstants.definitions), aliases_1.ALIASES);
exports.enums = __importStar(require("./enums"));
