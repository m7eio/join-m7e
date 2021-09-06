import React from 'react';
import { ethers } from 'ethers';
import LootAvatar from '../loot';
import useWalletProvider, { PROVIDER } from '../web3-wallet/wallet-provider';
import network from '../web3-wallet/network';
import { simpleAdress } from '../web3-wallet/connect-wallet';

import { useCallback, useState } from 'react';
import { BasicProfile } from 'dataverse-sdk';
import { fetchLoot, storeLootImg } from '../../dataverse/apis/loot';
import { 
  authenticateIDX,
  initCollections,
  initIDX,
  getDID,
  setCryptoAccounts,
  setProfile 
} from '../../dataverse/apis/ceramic';
import Message, { MessageTypes } from '../../dataverse/components/Message';

export default function JoinResult({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [isMetaMask, setMetaMask] = useState<boolean>();
  const { address, provider } = useWalletProvider({ network });
  const [providers, setProviders] = React.useState<ethers.providers.Web3Provider>();

  React.useEffect(() => {
    if (!address) return;

    if (provider === PROVIDER.METAMASK) {
      // @ts-ignore
      setProviders(new ethers.providers.Web3Provider(window.ethereum));
    }
  }, [address, provider]);

  const authenticate = useCallback(async () => {
    if (loading) {
      return;
    }

    if (isMetaMask === false) {
      window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn', '_blank');
      return;
    }

    setLoading(true);
    try {
      
      initIDX();
      const addresses = (await window.ethereum.request({ method: 'eth_requestAccounts' })) as Array<string>;
      
      const { character, items } = await fetchLoot(addresses[0]);

      console.log(items);

      alert('IDX Authentication');
      const [, cid] = await Promise.all([
        authenticateIDX(window.ethereum, address),
        storeLootImg(character)
      ]);

      console.log(cid);

      const did = getDID();
      console.log(did);
      
      const profile: BasicProfile = {
        name: 'test_name',
        description: 'test_description',
        image: {
          original: {
            src: 'ipfs://' + cid,
            mimeType: 'image/png',
            width: 1,
            height: 1,
          },
        },
        background: {
          original: {
            src: 'ipfs://bafy...',
            mimeType: 'image/png',
            width: 1,
            height: 1,
          },
        },
      };

      Message({ content: 'Initializing #Dataverse!' });

      alert('Curating Avator');

      await Promise.all([
        initCollections(),
        setCryptoAccounts(addresses[0]),
        setProfile(profile)
      ]);

      const redirectUrl = `<a href='https://dataverse.art/#/${did}' target='_blank'>[view in Dataverse]</a>`;
      Message({ content: redirectUrl, duration: 10_000 }); // cannot work here, why?

      alert(redirectUrl);

    } catch (error) {
      console.log(error);
      Message({ content: 'Failed!', type: MessageTypes.Error });
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [loading]);

  return (
    <div className="pt-40 fixed w-screen h-screen top-0	left-0 bg-black z-10 overflow-auto">
      <div className="flex flex-col justify-center items-center pb-10">
        <div className="absolute right-4 top-10 text-white border px-2 py-1">
          {simpleAdress(address, 6, 4)}
        </div>
        <div
          onClick={onClose}
          className="absolute left-4 top-10 text-white border px-2 py-1 cursor-pointer"
        >
          Close
        </div>
        <div className="text-white text-2xl	fonts-times-new-roman ">Congrats! </div>
        <div className="text-white text-2xl	fonts-times-new-roman">here’s your M7E passport</div>

        <div className="mt-14">
          <LootAvatar address={address} providers={providers} />
          <div className="text-gray-400 text-right mt-1">
            powered by{' '}
            <a href="https://twitter.com/stephancill" className="underline">
              @stephancill
            </a>
          </div>
        </div>

        <button className="h-14 w-60 px-4 py-2 bg-white text-black mb-4 mt-10 sm:mt-20" onClick={authenticate}>
          set as <span className="underline">Dataverse</span> avatar 👀
        </button>
        <button className="h-14 w-60 px-4 py-2 bg-white text-black mb-4">get airdrop 🦄</button>
        <a
          href="https://twitter.com/intent/retweet?tweet_id=1434167664520302597"
          className="h-14 w-60 px-4 py-2 bg-white text-black flex items-center justify-center"
        >
          share 🕺
        </a>
      </div>
    </div>
  );
}
