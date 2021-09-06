import React from 'react';
import classnames from 'classnames';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import * as ethers from 'ethers';

import Page from '../components/page';
import Layout from '../components/layout';
import useWalletProvider from '../components/web3-wallet/wallet-provider';
import network from '../components/web3-wallet/network';
import JoinResult from '../components/join-result';
import { switchWallet } from '../components/web3-wallet/connect-wallet';
import { SITE_NAME, META_DESCRIPTION } from '../common/const';

import Logo1 from '../public/images/imtoken.svg';
import Logo2 from '../public/images/dataverse.svg';
import Logo3 from '../public/images/goatnft.svg';
import Logo4 from '../public/images/nft4metaverse.svg';
import Footer from '../components/footer';

import styles from '../styles/index.module.css';

export default function Home() {
  const [twitter, setTwitter] = React.useState('');
  const [submiting, setSubmiting] = React.useState(false);
  const [showResult, setShowResult] = React.useState(false);
  const { address } = useWalletProvider({ network });

  const tNavigation = useTranslations('navigation');

  const meta = {
    title: `${tNavigation('home')} - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const cls = classnames(
    'main-content flex flex-col w-full h-full flex-1',
    'pb-8',
    // styles.container,
  );

  const onSearchChange = (e) => {
    setTwitter(e.target.value);
  };

  const submit = async () => {
    if (!address) {
      switchWallet();
      return;
    }

    if (!twitter) return;

    setSubmiting(true);
    try {
      await fetch('/api/form', {
        method: 'POST',
        body: JSON.stringify({
          twitter,
          address,
        }),
      });

      setShowResult(true);
    } catch (err) {
      // error
    }

    setSubmiting(false);
  };

  const renderButtonText = React.useMemo(() => {
    if (submiting) {
      return 'Loading...';
    }

    if (!address) {
      return 'Connect Wallet';
    }

    return 'Get M7E Passport';
  }, [address, submiting]);

  return (
    <Page meta={meta} className={styles.bg}>
      <Layout className={cls} headerBgCls="pt-14 flex flex-row w-full justify-end main-content">
        <div
          className={classnames(
            styles.loot,
            'text-white pt-4 text-sm sm:text-base xl:text-xl',
            'fonts-times-new-roman',
          )}
        >
          <p>Self Awakened</p>
          <p className="mt-1">Quest for Metaverse Identity</p>
          <p className="mt-1">Shanghai Metaverse Week</p>
          <p className="mt-1">October 22-28, 2021</p>
          <p className="mt-1">Read Online (m7e.sh, Twittersphere)</p>
          <p className="mt-1">
            Play in Metaverse (Somium Space, Decentraland, CryptoVoxels, Sandbox)
          </p>
          <p className="mt-1">Meet in Physical World (M50 Shanghai, Silicon Valley)</p>
          <p className="mt-1">
            Have Fun (NFT Claim, Airdrop, Exhibition, Forum, Meetup, Scavenger Hunt…)
          </p>
        </div>
        <div className="w-full flex flex-col sm:flex-row mt-8 fonts-times-new-roman ">
          <div className="flex items-center">
            <span className="text-white mr-2">@</span>
            <input
              placeholder="twitter hander"
              value={twitter}
              onChange={onSearchChange}
              className="h-10 sm:h-14 px-2 w-60 sm:w-80 bg-transparent border border-white	text-white"
            />
          </div>
          <button
            className={classnames(
              'h-10 sm:h-14 mt-4 sm:mt-0 w-40 px-4 py-2 bg-white text-black sm:ml-2',
            )}
            onClick={submit}
          >
            {renderButtonText}
          </button>
        </div>

        {showResult && (
          <JoinResult
            onClose={() => {
              setShowResult(false);
            }}
          />
        )}

        <div className="flex flex-col justify-end mt-4 flex-1">
          <div className="flex flex-row justify-content items-center">
            <a target="_blank" className="mr-2" href="https://twitter.com/imTokenOfficial">
              <Logo1 />
            </a>
            <a target="_blank" className="mr-2" href="https://twitter.com/OwnershipLabs">
              <Logo2 />
            </a>
            <a target="_blank" className="mr-2" href="https://twitter.com/goatnftio">
              <Logo3 className="mr-2" />
            </a>
            <a target="_blank" href="https://twitter.com/NFT4Metaverse">
              <Logo4 />
            </a>
          </div>
          <Footer />
        </div>
        <div className={styles.svgbox}>
          <img
            src="/images/bg.png"
            style={{
              position: 'absolute',
              width: 'auto',
              maxWidth: '100%',
              right: 0,
              bottom: 0,
              transform: "translate(35%, 31%)"
            }}
          />
        </div>
      </Layout>
    </Page>
  );
}

export async function getStaticProps({ locale = 'zh-CN' }) {
  return {
    props: {
      messages: {
        ...require(`../messages/common/${locale}.json`),
        ...require(`../messages/index/${locale}.json`),
      },
      now: new Date().getTime(),
      locale,
    },
  };
}
