/* eslint-disable camelcase */
import api from './cms';

export interface Post {
  id: string;
  cover: string;
  title: string;
  summary: string;
  slug: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  publishedAt: string;
  readingTime: number;
  html: string;
  first?: boolean;
  tags?: {
    name: string;
  }[];
}

export const getPosts = async (params?: { [key: string]: any }): Promise<Post[]> => {
  const res = await api.getPosts(params);
  const data = await res.json();

  const formatPosts = data.posts.map((post) => {
    const {
      title,
      slug,
      feature_image,
      custom_excerpt,
      excerpt,
      primary_author,
      published_at,
      reading_time,
    } = post;
    return {
      title,
      slug,
      cover: feature_image,
      summary: custom_excerpt || excerpt,
      author: {
        id: primary_author.id,
        name: primary_author.name,
        avatar: primary_author.profile_image,
      },
      publishedAt: published_at,
      readingTime: reading_time,
    };
  });

  return formatPosts;
};

export async function getPost(postSlug): Promise<Post> {
  const res = await api.getPost(postSlug);
  const data = await res.json();

  if (!data.posts || !data.posts.length) return;

  const {
    id,
    created_at,
    title,
    slug,
    html,
    feature_image,
    custom_excerpt,
    excerpt,
    primary_author,
    published_at,
    reading_time,
  } = data.posts[0];

  return {
    id,
    createdAt: created_at,
    title,
    slug,
    cover: feature_image,
    summary: custom_excerpt || excerpt,
    author: {
      id: primary_author.id,
      name: primary_author.name,
      avatar: primary_author.profile_image,
    },
    publishedAt: published_at,
    readingTime: reading_time,
    html,
  };
}
