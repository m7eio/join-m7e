import React, { useCallback, useState } from 'react';
import { BasicProfile } from 'dataverse-sdk';
import useWalletProvider from '../web3-wallet/wallet-provider';
import network from '../web3-wallet/network';
import { simpleAdress } from '../web3-wallet/connect-wallet';
import Modal from '../web3-wallet/modal';

import { fetchLoot, storeLootImg } from '../../dataverse/apis/loot';
import {
  authenticateIDX,
  initCollections,
  initIDX,
  getDID,
  setCryptoAccounts,
  setProfile,
} from '../../dataverse/apis/ceramic';
import Message, { MessageTypes } from '../../dataverse/components/Message';

export default function JoinResult({ onClose }) {
  const [loading, setLoading] = useState(false);
  const { address } = useWalletProvider({ network });
  const [showAirdropModal, setShowAirdropModal] = React.useState(false);
  const [avatar, setAvatar] = React.useState<string>('');

  const closeModal = React.useCallback(() => {
    setShowAirdropModal(false);
  }, [null]);

  const showModal = React.useCallback(() => {
    setShowAirdropModal(true);
  }, [null]);

  const getAvatar = React.useCallback(async (ethAddress: string) => {
    const { character, items } = await fetchLoot(ethAddress);
    console.log(items);
    setAvatar(character);
  }, [avatar]);

  React.useEffect(() => {
    if (address) {
      getAvatar(address);
    }
  }, [avatar, address]);

  const authenticate = useCallback(async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      initIDX();
      if(!avatar) throw new Error('Check your avatar')

      Message({ content: 'Start authenticating...' });
      const [, cid] = await Promise.all([
        authenticateIDX(window['ethereum' as keyof typeof window], address),
        storeLootImg(avatar),
      ]);

      console.log(cid);

      const did = getDID();
      console.log(did);

      const profile: BasicProfile = {
        name: 'test_name',
        description: 'test_description',
        image: {
          original: {
            src: `ipfs://${cid}`,
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

      Message({ content: 'Init your Dataverse...' });

      await Promise.all([initCollections(), setCryptoAccounts(address), setProfile(profile)]);

      const redirectUrl = `<a href='https://dataverse.art/#/${did}' target='_blank'>[View in Dataverse]</a>`;
      Message({ content: redirectUrl, duration: 0 });

    } catch (error) {
      console.log(error);
      Message({ content: 'Failed Network!', type: MessageTypes.Error });
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [loading, avatar]);

  const shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `I have claimed my #loot avatar passport that is qualified to win #NFT airdrops and have fun at #ShanghaiMetaverseWeek @imTokenOfficial @goatnftio @OwnershipLabs @NFT4Metaverse`,
  )}`;

  return (
    <div className="pt-24 fixed w-screen h-screen top-0	left-0 bg-black z-10 overflow-auto">
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
          <div className="border border-white w-80 h-80 sm:w-96	sm:h-96 flex justify-center items-center">
           { avatar ? <img className="w-full h-full" src={avatar} /> : <div className="text-white">Loading...</div> }
           </div>
          <div className="text-gray-400 text-right mt-1">
            powered by{' '}
            <a href="https://twitter.com/stephancill" className="underline">
              @stephancill
            </a>
          </div>
        </div>

        <button
          className="h-14 w-60 px-4 py-2 bg-white text-black mb-4 mt-10 sm:mt-20"
          onClick={authenticate}
        >
          set as <span className="underline">Dataverse</span> avatar 👀
        </button>
        <button
          className="h-14 w-60 px-4 py-2 bg-white text-black mb-4"
          onClick={showModal}
        >
          get airdrop 🦄
        </button>
        <a
          href={shareLink}
          target="_blank"
          className="h-14 w-60 px-4 py-2 bg-white text-black flex items-center justify-center"
        >
          share 🕺
        </a>
      </div>

      <Modal visible={showAirdropModal} onClose={closeModal}>
        <div className="mt-10">
          <a
            href="https://twitter.com/intent/follow?screen_name=goatnftio"
            target="_blank"
            className="hover:text-gray-200 mb-4 h-14 w-64 px-4 py-2 bg-black text-white flex items-center justify-center"
          >
            Follow GOATNFT on twitter
          </a>
          <a
            href="https://twitter.com/intent/follow?screen_name=imTokenOfficial"
            target="_blank"
            className="hover:text-gray-200 mb-4 h-14 w-64 px-4 py-2 bg-black text-white flex items-center justify-center"
          >
            Follow imToken on twitter
          </a>
          <a
            href="https://twitter.com/intent/follow?screen_name=OwnershipLabs"
            target="_blank"
            className="hover:text-gray-200 mb-4 h-14 w-64 px-4 py-2 bg-black text-white flex items-center justify-center"
          >
            Follow DataVerse on twitter
          </a>
          <a
            href="https://twitter.com/intent/follow?screen_name=NFT4Metaverse"
            target="_blank"
            className="hover:text-gray-200 mb-4 h-14 w-64 px-4 py-2 bg-black text-white flex items-center justify-center"
          >
            Follow NFT4Metaverse on twitter
          </a>
        </div>
      </Modal>
    </div>
  );
}
