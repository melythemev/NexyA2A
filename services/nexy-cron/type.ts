// Represents a single holding in a wallet
export interface HoldingResponse {
  address: string;
  avg_cost: string;
  avg_sold: string;
  balance: string;
  buy_30d: number;
  cost: string;
  end_holding_at: number;
  history_bought_cost: string;
  history_sold_income: string;
  last_active_timestamp: number;
  liquidity: string;
  position_percent: string;
  price: string;
  realized_pnl: string;
  realized_pnl_30d: string;
  realized_profit: string;
  realized_profit_30d: string;
  sells: number;
  sell_30d: number;
  start_holding_at: number;
  token: Token;
  total_profit: string;
  total_profit_pnl: string;
  unrealized_pnl: string;
  unrealized_profit: string;
  usd_value: string;
  wallet_token_tags: null;
}

// Represents a token object
interface Token {
  address: string;
  decimals: number;
  is_honeypot: null;
  is_show_alert: boolean;
  logo: string;
  name: string;
  price_change_6h: string;
  symbol: string;
  token_address: string;
}

export interface TrendingResponse {
  id: number;
  chain: string;
  address: string;
  symbol: string;
  logo: null | string;
  price: number;
  price_change_percent: number;
  swaps: number;
  volume: number;
  liquidity: number;
  market_cap: number;
  hot_level: number;
  pool_creation_timestamp: number;
  holder_count: number;
  twitter_username: null | string;
  website: null | string;
  telegram: null | string;
  open_timestamp: number;
  price_change_percent1m: number;
  price_change_percent5m: number;
  price_change_percent1h: number;
  buys: number;
  sells: number;
  swaps_24h: number;
  initial_liquidity: null | number;
  is_show_alert: boolean;
  top_10_holder_rate: number;
  renounced_mint: number;
  renounced_freeze_account: number;
  burn_ratio: string;
  burn_status: string;
  launchpad?: null | string;
  dev_token_burn_amount: null | string;
  dev_token_burn_ratio: null | number;
  dexscr_ad: number;
  dexscr_update_link: number;
  cto_flag: number;
  twitter_change_flag: number;
  creator_token_status: null | string;
  creator_close?: boolean;
  launchpad_status: number;
  rat_trader_amount_rate: number;
  bluechip_owner_percentage: number;
  smart_degen_count: number;
  renowned_count: number;
  is_wash_trading: boolean;
}

export interface TokenInfoResponse {
  chain: string;
  symbol: string;
  name: string;
  decimals: number;
  logo: string;
  address: string;
  price: number;
  price_1h: number;
  price_24h: number;
  swaps_5m: number;
  swaps_1h: number;
  swaps_6h: number;
  swaps_24h: number;
  volume_24h: number;
  liquidity: number;
  total_supply: number;
  is_in_token_list: boolean;
  hot_level: number;
  is_show_alert: boolean;
  buy_tax: null;
  sell_tax: null;
  is_honeypot: null;
  renounced: null;
  top_10_holder_rate: number;
  renounced_mint: number;
  renounced_freeze_account: number;
  burn_ratio: string;
  burn_status: string;
}

export interface RugHistoryResponse {
  chain: string;
  token_address: string;
  name: string;
  symbol: string;
  logo: string;
  rug_ratio: number;
  holder_rugged_num: number;
  holder_token_num: number;
  history: History[];
}

export interface History {
  id: number;
  token_address: string;
  holder_num: number;
  rugged_token_num: number;
  holder_token_num: number;
  rugged_tokens: string;
  creator: null;
  is_token_rugged: number;
  rugged_type: string;
  website: string;
  website_ip: null | string;
  rugged_at: number;
  rugged_duration: number;
  updated_at: number;
  address: string;
  name: string;
  symbol: string;
  logo: string;
  creation_timestamp: number;
  open_timestamp: number;
  telegram: string;
  twitter_username: string;
}

export interface TrendingFilterParams {
  trending_timeframe: "1m" | "5m" | "1h" | "6h" | "24h";
  orderby: string;
  direction: string;
  min_liquidity: number;
  max_liquidity: number;
  min_marketcap: number;
  max_marketcap: number;
  min_volume: number;
  max_volume: number;
  min_swaps: number;
  max_swaps: number;
  min_holder_count: number;
  max_holder_count: number;
  min_created_time: string;
  max_created_time: string;
  filters: string[];
}

export interface TokenInfoStatsResponse {
  token_address: string;
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
  total_supply: number;
  balance: string;
  buy_30d: number;
  sell_30d: number;
  sells: number;
  unrealized_profit: number;
  unrealized_pnl: null;
  realized_profit: number;
  realized_profit_30d: number;
  realized_pnl_30d: null;
  total_profit: number;
  total_pnl: null;
  pnl: null;
  total_trade: number;
  avg_cost: number;
  history_avg_cost: number;
  history_bought_cost: number;
  history_bought_amount: number;
  buy_cost: number;
  sold_usd: number;
  avg_sold: number;
  hot_level: number;
  amount_percentage: number;
  maker_info: Makerinfo;
  market_cap: number;
  last_active_timestamp: number;
  price: number;
  trades: any[];
}

interface Makerinfo {
  address: string;
  twitter_username: null;
  avatar: null;
  ens: null;
  tag: null;
  tag_rank: Tagrank;
  nickname: null;
  created_at: number;
  tags: string[];
  twitter_name: null;
  followers_count: number;
  is_blue_verified: boolean;
  twitter_description: null;
  bind: number;
  name: null;
}

interface Tagrank {
  nexy_cron: null;
}

export interface PostCoinInfoResponse {
  code: number;
  reason: string;
  message: string;
  data: Datum[];
}

export interface Datum {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logo: string;
  biggest_pool_address: string;
  open_timestamp: number;
  holder_count: number;
  circulating_supply: string;
  total_supply: string;
  max_supply: string;
  liquidity: string;
  creation_timestamp: number;
  pool: Pool;
  dev: Dev;
  price: Price;
}

interface Price {
  address: string;
  price: string;
  price_1m: string;
  price_5m: string;
  price_1h: string;
  price_6h: string;
  price_24h: string;
  buys_1m: number;
  buys_5m: number;
  buys_1h: number;
  buys_6h: number;
  buys_24h: number;
  sells_1m: number;
  sells_5m: number;
  sells_1h: number;
  sells_6h: number;
  sells_24h: number;
  volume_1m: string;
  volume_5m: string;
  volume_1h: string;
  volume_6h: string;
  volume_24h: string;
  buy_volume_1m: string;
  buy_volume_5m: string;
  buy_volume_1h: string;
  buy_volume_6h: string;
  buy_volume_24h: string;
  sell_volume_1m: string;
  sell_volume_5m: string;
  sell_volume_1h: string;
  sell_volume_6h: string;
  sell_volume_24h: string;
  swaps_1m: number;
  swaps_5m: number;
  swaps_1h: number;
  swaps_6h: number;
  swaps_24h: number;
  hot_level: number;
}

interface Dev {
  address: string;
  creator_address: string;
  creator_token_balance: string;
  creator_token_status: string;
  twitter_name_change_history: any[];
  top_10_holder_rate: string;
  dexscr_ad: number;
  dexscr_update_link: number;
  cto_flag: number;
}

interface Pool {
  address: string;
  pool_address: string;
  quote_address: string;
  quote_symbol: string;
  liquidity: string;
  base_reserve: string;
  quote_reserve: string;
  initial_liquidity: string;
  initial_base_reserve: string;
  initial_quote_reserve: string;
  creation_timestamp: number;
  base_reserve_value: string;
  quote_reserve_value: string;
  quote_vault_address: string;
  base_vault_address: string;
  creator: string;
  exchange: string;
  token0_address: string;
  token1_address: string;
  base_address: string;
  fee_ratio: string;
}
