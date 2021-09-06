import * as qs from 'qs';

require('isomorphic-fetch');

class ContentAPI {
  private url: string;

  private key: string;

  constructor(url: string, key: string) {
    this.url = url;
    this.key = key;
  }

  getPosts(params: { [key: string]: any } = {}) {
    const search = qs.stringify(
      { key: this.key, include: 'authors,tags', order: 'published_at desc', ...params },
      { addQueryPrefix: true },
    );
    const url = `${this.url}/content/posts${search}`;
    console.log('===> ContentAPI getPosts: ', url);
    return fetch(url);
  }

  getPost(slug: string, params: { [key: string]: any } = {}) {
    const search = qs.stringify(
      { key: this.key, limit: 1, include: 'authors,tags', ...params },
      { addQueryPrefix: true },
    );
    const url = `${this.url}/content/posts/slug/${slug}/${search}`;

    return fetch(url);
  }
}

const contentApi = new ContentAPI(
  process.env.GHOST_CMS_URL,
  process.env.GHOST_CONTENT_API_KEY,
);
export default contentApi;
