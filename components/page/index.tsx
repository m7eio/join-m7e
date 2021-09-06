import cn from 'classnames';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { SITE_NAME, SITE_URL } from '../../common/const';

type Meta = {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  // eslint-disable-next-line camelcase
  primary_author?: string;
};

type Props = {
  meta: Meta;
  children: React.ReactNode;
  className?: string;
  fullViewport?: boolean;
};

export default function Page({ meta, children, className, fullViewport = false }: Props) {
  const router = useRouter();
  const image = meta.image || '/images/logo.png';
  const title = meta.title || SITE_NAME;
  const url = meta.url || `${SITE_URL}${router.asPath}`;
  const description = meta.description || SITE_NAME;

  return (
    <div className={cn('page-container', className, { full: fullViewport })}>
      <Head>
        <title>{title}</title>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no"
        />
        <meta name="description" content={description} />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="twitter:card" content={meta.image ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:site" content="@NFT4Metaverse" />
        <meta name="twitter:creator" content={meta.primary_author || 'NFT4Metaverse'} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
      </Head>
      {children}
    </div>
  );
}
