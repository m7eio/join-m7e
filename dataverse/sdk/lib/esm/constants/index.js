import * as idxConstants from '@ceramicstudio/idx-constants';
import { PUBLISHED_DEFINITIONS } from './definitions';
import { PUBLISHED_SCHEMAS } from './schemas';
import { ALIASES } from './aliases';
export const definitions = {
    ...idxConstants.definitions,
    ...PUBLISHED_DEFINITIONS,
};
export const schemas = {
    ...idxConstants.schemas,
    ...PUBLISHED_SCHEMAS,
};
export const aliases = {
    ...idxConstants.definitions,
    ...ALIASES,
};
export * as enums from './enums';
