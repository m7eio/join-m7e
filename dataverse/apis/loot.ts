import { NFTStorage } from 'nft.storage';
import { ethers } from 'ethers';
import { Buffer } from 'buffer';

import mergeImages from 'merge-images';
import { LAYER_ORDER } from './artifacts/layerOrder';
import { LAYER_MAPPING } from './artifacts/layerMapping';
import { Synthetic_LOOT } from './artifacts/SyntheticLoot';

const apiKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEEzOTU5MUNGOUExYUVDMzllNUVGNmExQzI2MDc5NDA5RUEyMDk3ODgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyNzU3MDY0MTAxMSwibmFtZSI6ImRhdGF2ZXJzZSJ9.iYqoQZc_N-pThgPH_c3saB54C1_7U3JY2K1d62ZcDWg';
const imgDir = `ipfs://QmUEvrQtE67en6upRT6K4j1LD58VQ6oAQQJ6cWy9MPk1TL`;

export const jsonProxy = (url: string) =>
  `https://allorigins.dataverse.art/raw?url=${encodeURIComponent(url)}`;

export async function storeLootImg(blob_data: string) {
  const storage = new NFTStorage({ token: apiKey });
  const cid = await storage.storeBlob(new Blob([blob_data]));
  return cid;
}

export async function fetchLoot(address: string) {
  let provider;
  if (window['ethereum' as keyof typeof window]) {
    provider = new ethers.providers.Web3Provider(window['ethereum' as keyof typeof window]);
  } else {
    provider = new ethers.providers.JsonRpcProvider(
      'https://mainnet.infura.io/v3/f29f1c340a60430ebff33f1ed9dad190',
    );
  }

  const syntheticLoot = new ethers.Contract(
    '0x869ad3dfb0f9acb9094ba85228008981be6dbdde',
    Synthetic_LOOT,
    provider,
  );

  const tokenURIB64 = await syntheticLoot.tokenURI(address);
  const tokenURI = JSON.parse(Buffer.from(tokenURIB64.split(',')[1], 'base64').toString('utf8'));
  const b64svg = tokenURI.image;
  const svg = Buffer.from(b64svg.split(',')[1], 'base64').toString('utf8');

  const items = itemsFromSvg(svg);
  const img = await getImageForLoot(items);

  return {
    lootImage: b64svg,
    character: img,
    items,
  };
}

export async function getImageForLoot(loot: any) {
  const LAYERS = getLayers(loot);
  let files: string[] = [];
  LAYER_ORDER.forEach((layerName) => {
    if (LAYERS[layerName]) {
      files.push(LAYERS[layerName]);
    }
  });

  files = files.map((file) => {
    if (file.indexOf('ipfs://') > -1) {
      file = `https://ipfs.io/ipfs/${file.split('ipfs://')[1]}`;
      file = jsonProxy(file);
    }
    return file;
  });

  const b64img = await mergeImages(files, { crossOrigin: 'anonymous' });

  return b64img;
}

// https://github.com/bpierre/loot-rarity/blob/main/src/image.ts#L24
export function itemsFromSvg(svg: string) {
  if (!svg.startsWith('<svg')) {
    throw new Error('The svg paramater doesn’t seem to be an SVG');
  }

  let matches;
  const items = [];
  for (let i = 0; i < 8; i++) {
    // eslint-disable-next-line
    const matcher = /<text[^>]+\>([^<]+)<\/text>/;
    matches = svg.match(matcher);
    if (!matches) {
      if (items.length === 0) {
        throw new Error('Error when parsing the SVG: couldn’t find the next item');
      }
      // Probably a LootLoose image
      return items;
    }
    items.push(matches[1]);
    svg = svg.slice(svg.indexOf(matches[0]) + matches[0].length);
  }
  return items;
}

function getLayers(LOOT: any) {
  if (Array.isArray(LOOT)) {
    const keys = ['weapon', 'chest', 'head', 'waist', 'foot', 'hand', 'neck', 'ring'];
    const map: { [key: string]: string[] } = {};
    keys.forEach((key, i) => {
      map[key] = LOOT[i];
    });
    LOOT = map;
  }

  const LAYERS: any = {
    fg: `${imgDir}/fg.png`,
    bg: `${imgDir}/bg.png`, // Foreground & Background are at the root
    weaponName: null,
    weaponPrefix: null,
    weaponSuffix: null,
    weaponPlusOne: null,
    chestName: null,
    chestPrefix: null,
    chestSuffix: null,
    chestPlusOne: null,
    headName: null,
    headPrefix: null,
    headSuffix: null,
    headPlusOne: null,
    waistName: null,
    waistPrefix: null,
    waistSuffix: null,
    waistPlusOne: null,
    footName: null,
    footPrefix: null,
    footSuffix: null,
    footPlusOne: null,
    handName: null,
    handPrefix: null,
    handSuffix: null,
    handPlusOne: null,
    neckName: null,
    neckPrefix: null,
    neckSuffix: null,
    neckPlusOne: null,
    ringName: null,
    ringPrefix: null,
    ringSuffix: null,
    ringPlusOne: null,
  };

  Object.keys(LOOT).forEach((key) => updateLayers(key, LOOT[key], LAYERS));

  return LAYERS;
}

function updateLayers(loot_name: string, loot: string, LAYERS: any) {
  const parsedName = parseName(loot);

  const mapping: any = LAYER_MAPPING;

  LAYERS[`${loot_name}Name`] = `${imgDir}/${mapping[loot_name].name[parsedName.name]}`;

  // Prefix
  if (parsedName.prefix) {
    LAYERS[`${loot_name}Prefix`] = `${imgDir}/${mapping[loot_name].prefix}`;
  }

  // Suffix
  if (parsedName.suffix) {
    LAYERS[`${loot_name}Suffix`] = `${imgDir}/${
      mapping[loot_name].suffix[parsedName.name][parsedName.suffix]
    }`;
  }

  // +1
  if (parsedName.plusOne) {
    LAYERS[`${loot_name}PlusOne`] = `${imgDir}/${mapping[loot_name].plus_one}`;
  }
}

function parseName(name: string) {
  const parsedName = {
    hasPrefix: false,
    prefix: '',
    hasSuffix: false,
    suffix: '',
    plusOne: false,
    name: '',
  };

  let splitName;

  // Check for prefix
  if (name[0] === '"') {
    parsedName.hasPrefix = true;
    splitName = name.split('"');
    parsedName.prefix = splitName[1];
    name = splitName[2]; // NOTE - we modify the function arg `name`
  }

  // Check for suffix
  if (name.indexOf(' of ') >= 0) {
    parsedName.hasSuffix = true;
    splitName = name.split(' of ');
    parsedName.suffix = `of ${splitName[1]}`;
    if (parsedName.suffix.indexOf(' +1') >= 0) {
      parsedName.plusOne = true;
      parsedName.suffix = parsedName.suffix.split(' +1')[0];
    }
    name = splitName[0]; // NOTE - we modify the function arg `name`
  }

  parsedName.name = name.trim();

  return parsedName;
}
