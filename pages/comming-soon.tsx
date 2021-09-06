import classnames from 'classnames';
import Page from '../components/page';
import Layout from '../components/layout';
import H1 from '../components/h1';
import { SITE_NAME, META_DESCRIPTION } from '../common/const';
import styles from '../styles/index.module.css';

export default function Home({ posts }) {
  const meta = {
    title: `Waiting - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const cls = classnames('main-content', 'pb-8', 'flex flex-col	', styles.container);

  return (
    <Page meta={meta}>
      <Layout className={cls}>
        <main className="flex w-full flex-1 justify-center items-center	">
          <H1 className="text-white">Comming soon...</H1>
        </main>
      </Layout>
    </Page>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      messages: {
        ...require(`../messages/common/${locale}.json`),
        ...require(`../messages/index/${locale}.json`),
      },
      now: new Date().getTime(),
    },
  };
}
