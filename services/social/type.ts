export interface TopicPostResponse {
  config: Config;
  data: PostItem[];
}

export interface PostItem {
  id: string;
  post_type: string;
  post_title: string;
  post_link: string;
  post_image: null | string;
  post_created: number;
  post_sentiment: number;
  creator_id: string;
  creator_name: string;
  creator_display_name: string;
  creator_followers: number | string;
  creator_avatar: string;
  interactions_24h: number;
  interactions_total: number;
}

interface Config {
  topic: string;
  type: string;
  id: string;
  generated: number;
}

export interface CreatorsResponse {
  data: Creator[];
}

export interface Creator {
  creator_id: string;
  creator_name: string;
  creator_avatar: string;
  creator_followers: number | string;
  creator_rank: number;
  interactions_24h: number;
}

export interface TopicInfoV3Response {
  topic: string;
  num_contributors: number;
  top_topics: Toptopic[];
  top_assets: Topasset[];
  created: number;
  rank: number;
  version: number;
  sentiment_positive_posts: number;
  sentiment_positive_interactions: number;
  sentiment_neutral_posts: number;
  sentiment_neutral_interactions: number;
  sentiment_negative_posts: number;
  sentiment_negative_interactions: number;
  posts_active: number;
  posts_active_prev: number;
  posts_created: number;
  posts_created_prev: number;
  contributors_active: number;
  contributors_active_prev: number;
  contributors_created: number;
  contributors_created_prev: number;
  types_count: Typescount;
  types_eng: Typescount;
  types_sentiment: Typescount;
  sentiment_types: Sentimenttypes;
  score1h: number;
  score24h: number;
  sentiment: number;
  sentiment_prev: number;
  posts: Post[];
  news: News[];
  num_posts: number;
  assets: any[];
  categories: any[];
  title: string;
  last_updated: number;
  last_searched: Lastsearched;
  id: string;
  type: string;
  total_topics: number;
  influencers: Influencer[];
  related_topics: string[];
  interactions_24h: number;
  interactions_24h_prev: number;
  interactions_24h_change: number;
  interactions_1h: number;
  trend: string;
  rank_mini_ts: string;
  rank_1h: number;
  rank_1h_prev: number;
  rank_24h: number;
  rank_24h_prev: number;
  topic_rank: number;
  topic_rank_prev: number;
  image: string;
}

interface Influencer {
  lunar_id: string;
  network: string;
  value: string;
  name: string;
  display_name: string;
  avatar: string;
  followers: number | string;
  interactions_1h: number;
  interactions_24h: number;
  interactions_24h_prev: number;
  influencer_rank: number;
}

interface Lastsearched {
  twitter: number;
  tiktok: number;
  youtube: number;
  reddit: number;
  instagram: number;
  news: number;
}

interface News {
  type: string;
  id: string;
  first_queued: number;
  last_fetched: number;
  influencer_id: string;
  influencer_name: string;
  influencer_display_name: string;
  influencer_avatar: string;
  influencer_followers: number;
  created: number;
  image: Video;
  title: string;
  score24h: number;
  sentiment: number;
  categories: string[];
  post_link: string;
  related_topics: string[];
  total_interactions: number;
  interactions_mini_ts: string;
  interactions_24h: number;
  interactions_24h_prev: number;
  interactions_24h_change: number;
  trend: string;
}

interface Post {
  type: string;
  id: string;
  first_queued: number;
  last_fetched: number;
  influencer_id: string;
  influencer_name: string;
  influencer_display_name: string;
  influencer_avatar: string;
  influencer_followers: number | string;
  title: string;
  created: number;
  video?: Video;
  score24h: number;
  sentiment: number;
  categories: string[];
  post_link: string;
  related_topics: string[];
  total_interactions: number;
  interactions_mini_ts: string;
  interactions_24h: number;
  interactions_24h_prev: number;
  interactions_24h_change: null | number;
  trend: string;
  image?: Video;
}

interface Video {
  src: string;
  width: number;
  height: number;
}

interface Sentimenttypes {
  tweet: Tweet;
  "reddit-post": Tweet;
  "tiktok-video": Tweet;
  "youtube-video": Tweet;
  news: Tweet;
}

interface Tweet {
  positive: number;
  neutral: number;
  negative: number;
}

interface Typescount {
  tweet: number;
  "reddit-post": number;
  "tiktok-video": number;
  "youtube-video": number;
  news: number;
}

interface Topasset {
  asset: string;
  topic: string;
  name: string;
  symbol: string;
  percent: number;
}

interface Toptopic {
  topic: string;
  count: number;
  percent: number;
}

export interface GetCoinChartResponse {
  config: {
    interval: string;
    coin: number;
    topic: string;
    start: number;
    end: number;
    bucket: string;
    ch: string;
    generated: number;
  };
  data: {
    time: number;
    open: number;
    close: number;
    high: number;
    low: number;
    volume_24h: number;
    sentiment: number;
    spam: number;
    galaxy_score: number;
    volatility: number;
    alt_rank: number;
    contributors_active: number;
    contributors_created?: number;
    posts_active: number;
    posts_created?: number;
    interactions: number;
    social_dominance: number;
  }[];
}
