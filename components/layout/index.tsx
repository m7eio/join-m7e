import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { SkipNavContent } from '@reach/skip-nav';

import ConnectWallet from '../web3-wallet/connect-wallet';
import ChooseWallet from '../web3-wallet';
import network from '../web3-wallet/network';

import MobileMenu from '../mobile-menu';
import { NAVIGATION } from '../../common/const';
import SwitchLocale from '../switch-locale';

// import Logo from './icons/icon-logo';
import Footer from '../footer';

type Props = {
  children: React.ReactNode;
  className?: string;
  hideNav?: boolean;
  layoutStyles?: any;
  fixed?: boolean;
  headerBgCls?: string;
  extra?: React.ReactNode;
};

export default function Layout({
  children,
  className,
  hideNav,
  layoutStyles,
  fixed = false,
  headerBgCls,
  extra,
}: Props) {
  const router = useRouter();
  const activeRoute = router.asPath;
  const t = useTranslations('navigation');

  return (
    <>
      <ChooseWallet network={network} />
      <div className={cn('min-h-screen', 'w-full', 'h-full', 'flex', 'flex-col')}>
        <div
          className={cn(headerBgCls, 'h-24', {
            'fixed-center': fixed,
          })}
          style={{ zIndex: 1 }}
        >
          <ConnectWallet network={network} />
        </div>

        <div className="flex-1 flex flex-col">
          <main style={layoutStyles} className="flex-1 flex-col flex">
            <SkipNavContent />
            <div className={className}>{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
