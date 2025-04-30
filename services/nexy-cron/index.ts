import axios from "axios";
import { nanoid } from "nanoid";
import {
  HoldingResponse,
  PostCoinInfoResponse,
  RugHistoryResponse,
  TokenInfoResponse,
  TokenInfoStatsResponse,
  TrendingFilterParams,
  TrendingResponse,
} from "./type.js";

// Main service for nexy-cron API integration
const NexyService = {
  fetchWalletHoldings: async (
    address: string,
    cursor?: string
  ): Promise<
    | {
        data: {
          holdings: HoldingResponse[];
          next?: string;
        };
      }
    | undefined
  > => {
    const url = `https://nexy-cron.mobi/api/v1/wallet_holdings/sol/${address}`;
    const params = {
      device_id: nanoid(16),
      client_id: "nexy-cron_android_304000",
      from_app: "nexy-cron",
      app_ver: "304000",
      os: "android",
      limit: 50,
      orderby: "last_active_timestamp",
      direction: "desc",
      showsmall: false,
      sellout: false,
      hide_abnormal: true,
      ...(cursor ? { cursor } : {}),
    };

    const headers = {
      Host: "nexy-cron.mobi",
      Accept: "application/json, text/plain, */*",
      "sentry-trace": "b3b9d3109dcd4d498cb755d3873a51dc-80d20d9501375064",
      baggage:
        "sentry-environment=production,sentry-public_key=3f0b45f62be1da949a7cf394be9d0459,sentry-trace_id=b3b9d3109dcd4d498cb755d3873a51dc",
      "User-Agent": "okhttp/4.9.2",
    };

    const response = await axios.get(url, { params, headers });
    return response.data;
  },

  fetchAllHoldings: async (address: string): Promise<HoldingResponse[]> => {
    const allHoldings: HoldingResponse[] = [];

    try {
      let nextCursor: string | undefined = undefined;
      let attempts = 0;

      do {
        const response = await NexyService.fetchWalletHoldings(
          address,
          nextCursor
        );

        if (response?.data?.holdings) {
          allHoldings.push(...response.data.holdings);
        }

        nextCursor = response?.data?.next;
        attempts++;
      } while (nextCursor && attempts < 2);

      return allHoldings;
    } catch (error) {
      console.error("Error fetching holdings:", error);
      return [];
    }
  },

  fetchTrending: async (
    args: Partial<TrendingFilterParams>
  ): Promise<TrendingResponse[]> => {
    const { trending_timeframe, ...paramArgs } = args;
    const timeFrame = args?.trending_timeframe || "24h";

    const url = `https://nexy-cron.mobi/defi/quotation/v1/rank/sol/swaps/${timeFrame}`;
    const params = {
      device_id: nanoid(16),
      client_id: "nexy-cron_android_304000",
      from_app: "nexy-cron",
      app_ver: "304000",
      os: "android",
      limit: 50,
      orderby: "market_cap",
      direction: "desc",
      ...paramArgs,
    };

    const headers = {
      Host: "nexy-cron.mobi",
      Accept: "application/json, text/plain, */*",
      "sentry-trace": "b3b9d3109dcd4d498cb755d3873a51dc-80d20d9501375064",
      baggage:
        "sentry-environment=production,sentry-public_key=3f0b45f62be1da949a7cf394be9d0459,sentry-trace_id=b3b9d3109dcd4d498cb755d3873a51dc",
      "User-Agent": "okhttp/4.9.2",
    };

    const response = await axios.get(url, { params, headers });

    return response.data?.data?.rank || [];
  },

  fetchTokenTrade: async (
    address: string,
    tag: "kol" | "whale"
  ): Promise<number> => {
    const url = `https://nexy-cron.mobi/api/v1/token_trades/sol/${address}`;
    const params = {
      device_id: nanoid(16),
      client_id: "nexy-cron_android_304000",
      from_app: "nexy-cron",
      app_ver: "304000",
      os: "android",
      limit: 100,
      tag,
    };

    const headers = {
      Host: "nexy-cron.mobi",
      Accept: "application/json, text/plain, */*",
      "sentry-trace": "b3b9d3109dcd4d498cb755d3873a51dc-80d20d9501375064",
      baggage:
        "sentry-environment=production,sentry-public_key=3f0b45f62be1da949a7cf394be9d0459,sentry-trace_id=b3b9d3109dcd4d498cb755d3873a51dc",
      "User-Agent": "okhttp/4.9.2",
    };

    const response = await axios.get(url, { params, headers });
    return response.data?.data?.history?.length || [];
  },

  fetchCoinInfo: async (address: string): Promise<TokenInfoResponse | null> => {
    try {
      const url = `https://nexy-cron.mobi/defi/quotation/v1/tokens/sol/search?q=${address}`;

      const params = {
        device_id: nanoid(16),
        client_id: "nexy-cron_android_304000",
        from_app: "nexy-cron",
        app_ver: "304000",
        os: "android",
      };

      const headers = {
        Host: "nexy-cron.mobi",
        Accept: "application/json, text/plain, */*",
        "sentry-trace": "b3b9d3109dcd4d498cb755d3873a51dc-80d20d9501375064",
        baggage:
          "sentry-environment=production,sentry-public_key=3f0b45f62be1da949a7cf394be9d0459,sentry-trace_id=b3b9d3109dcd4d498cb755d3873a51dc",
        "User-Agent": "okhttp/4.9.2",
      };

      const response = await axios.get(url, { params, headers });
      return response.data?.data?.tokens?.[0];
    } catch (err) {
      return null;
    }
  },

  fetchCoinSocial: async (address: string) => {
    try {
      const url = `https://nexy-cron.mobi/api/v1/mutil_window_token_link_rug_vote/sol/${address}`;
      const params = {
        device_id: nanoid(16),
        client_id: "nexy-cron_android_304000",
        from_app: "nexy-cron",
        app_ver: "304000",
        os: "android",
      };

      const headers = {
        Host: "nexy-cron.mobi",
        Accept: "application/json, text/plain, */*",
        "sentry-trace": "b3b9d3109dcd4d498cb755d3873a51dc-80d20d9501375064",
        baggage:
          "sentry-environment=production,sentry-public_key=3f0b45f62be1da949a7cf394be9d0459,sentry-trace_id=b3b9d3109dcd4d498cb755d3873a51dc",
        "User-Agent": "okhttp/4.9.2",
      };

      const response = await axios.get(url, { params, headers });

      return response.data?.data;
    } catch (err) {
      return null;
    }
  },

  fetchRugHistory: async (address: string) => {
    try {
      const url = `https://nexy-cron.mobi/defi/quotation/v1/tokens/rug_history/sol/${address}`;
      const params = {
        device_id: nanoid(16),
        client_id: "nexy-cron_android_304000",
        from_app: "nexy-cron",
        app_ver: "304000",
        os: "android",
      };

      const headers = {
        Host: "nexy-cron.mobi",
        Accept: "application/json, text/plain, */*",
        "sentry-trace": "b3b9d3109dcd4d498cb755d3873a51dc-80d20d9501375064",
        baggage:
          "sentry-environment=production,sentry-public_key=3f0b45f62be1da949a7cf394be9d0459,sentry-trace_id=b3b9d3109dcd4d498cb755d3873a51dc",
        "User-Agent": "okhttp/4.9.2",
      };

      const response = await axios.get(url, { params, headers });

      return response.data?.data as RugHistoryResponse;
    } catch (err) {
      return null;
    }
  },

  fetchSearch: async (address: string): Promise<TokenInfoResponse[] | null> => {
    try {
      const url = `https://nexy-cron.mobi/defi/quotation/v1/tokens/sol/search?q=${address}`;

      const params = {
        device_id: nanoid(16),
        client_id: "nexy-cron_android_304000",
        from_app: "nexy-cron",
        app_ver: "304000",
        os: "android",
      };

      const headers = {
        Host: "nexy-cron.mobi",
        Accept: "application/json, text/plain, */*",
        "sentry-trace": "b3b9d3109dcd4d498cb755d3873a51dc-80d20d9501375064",
        baggage:
          "sentry-environment=production,sentry-public_key=3f0b45f62be1da949a7cf394be9d0459,sentry-trace_id=b3b9d3109dcd4d498cb755d3873a51dc",
        "User-Agent": "okhttp/4.9.2",
      };

      const response = await axios.get(url, { params, headers });
      return response.data?.data?.tokens;
    } catch (err) {
      return null;
    }
  },
  fetchWalletStat: async ({
    wallet,
    tokenAddress,
  }: {
    wallet: string;
    tokenAddress: string;
  }) => {
    try {
      const url = `https://nexy-cron.mobi/defi/quotation/v1/smartmoney/sol/walletstat/${wallet}`;

      const params = {
        device_id: nanoid(16),
        client_id: "nexy-cron_android_304000",
        from_app: "nexy-cron",
        app_ver: "304000",
        os: "android",
        token_address: tokenAddress,
      };

      const headers = {
        Host: "nexy-cron.mobi",
        Accept: "application/json, text/plain, */*",
        "sentry-trace": "b3b9d3109dcd4d498cb755d3873a51dc-80d20d9501375064",
        baggage:
          "sentry-environment=production,sentry-public_key=3f0b45f62be1da949a7cf394be9d0459,sentry-trace_id=b3b9d3109dcd4d498cb755d3873a51dc",
        "User-Agent": "okhttp/4.9.2",
      };

      const response = await axios.get(url, { params, headers });

      return response.data?.data as TokenInfoStatsResponse;
    } catch (err) {
      return null;
    }
  },
  fetchHolders: async (token: string) => {
    try {
      const url = `https://nexy-cron.mobi/defi/quotation/v1/tokens/top_holders/sol/${token}`;

      const params = {
        device_id: nanoid(16),
        client_id: "nexy-cron_android_304000",
        from_app: "nexy-cron",
        app_ver: "304000",
        os: "android",
        orderby: "amount_percentage",
        limit: 20,
        cost: 20,
        direction: "desc",
      };

      const headers = {
        Host: "nexy-cron.mobi",
        Accept: "application/json, text/plain, */*",
        "sentry-trace": "b3b9d3109dcd4d498cb755d3873a51dc-80d20d9501375064",
        baggage:
          "sentry-environment=production,sentry-public_key=3f0b45f62be1da949a7cf394be9d0459,sentry-trace_id=b3b9d3109dcd4d498cb755d3873a51dc",
        "User-Agent": "okhttp/4.9.2",
      };

      const response = await axios.get(url, { params, headers });
      const holders = response.data?.data || [];
      return holders;
    } catch (err) {
      return null;
    }
  },
  fetchWalletActivity: async ({
    cursor = "",
    wallet,
  }: {
    cursor?: string;
    wallet: string;
  }) => {
    try {
      const url = `https://nexy-cron.mobi/api/v1/wallet_activity/sol`;

      const params = {
        device_id: nanoid(16),
        client_id: "nexy-cron_android_304000",
        from_app: "nexy-cron",
        app_ver: "304000",
        os: "android",
        type: ["buy", "sell", "transferIn", "transferOut", "add", "remove"],
        wallet,
        limit: 10,
        cost: 10,
        cursor,
      };

      const headers = {
        Host: "nexy-cron.mobi",
        Accept: "application/json, text/plain, */*",
        "sentry-trace": "b3b9d3109dcd4d498cb755d3873a51dc-80d20d9501375064",
        baggage:
          "sentry-environment=production,sentry-public_key=3f0b45f62be1da949a7cf394be9d0459,sentry-trace_id=b3b9d3109dcd4d498cb755d3873a51dc",
        "User-Agent": "okhttp/4.9.2",
      };

      const response = await axios.get(url, { params, headers });
      return response.data?.data;
    } catch (err) {
      return null;
    }
  },
  postCoinInfo: async (addresses: string[]) => {
    try {
      const url = `https://nexy-cron.mobi/api/v1/mutil_window_token_info`;

      const params = {
        device_id: nanoid(16),
        client_id: "nexy-cron_android_304000",
        from_app: "nexy-cron",
        app_ver: "304000",
        os: "android",
      };

      const headers = {
        Host: "nexy-cron.mobi",
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "sentry-trace": "b3b9d3109dcd4d498cb755d3873a51dc-80d20d9501375064",
        baggage:
          "sentry-environment=production,sentry-public_key=3f0b45f62be1da949a7cf394be9d0459,sentry-trace_id=b3b9d3109dcd4d498cb755d3873a51dc",
        "User-Agent": "okhttp/4.9.2",
      };

      const data = {
        chain: "sol",
        addresses: addresses,
      };

      const response = await axios.post<PostCoinInfoResponse>(url, data, {
        params,
        headers,
      });
      return response.data?.data?.[0] || null;
    } catch (err) {
      return null;
    }
  },
  fetchWalletStat7d: async (wallet: string): Promise<any> => {
    try {
      const url = `https://nexy-cron.mobi/api/v1/wallet_stat/sol/${wallet}/7d`;

      const params = {
        period: "7d",
        device_id: nanoid(16),
        client_id: "nexy-cron_android_304000",
        from_app: "nexy-cron",
        app_ver: "304000",
        os: "android",
      };

      const headers = {
        Host: "nexy-cron.mobi",
        Accept: "application/json, text/plain, */*",
        "User-Agent": "okhttp/4.9.2",
      };

      const response = await axios.get(url, { params, headers });
      return response.data;
    } catch (err) {
      return null;
    }
  },

  fetchRecentPnl: async (wallet: string): Promise<any> => {
    try {
      const url = `https://nexy-cron.mobi/api/v1/wallet_holdings/sol/${wallet}`;
      const params = {
        limit: 50,
        orderby: "last_active_timestamp",
        direction: "desc",
        showsmall: true,
        sellout: true,
        tx30d: true,
        device_id: nanoid(16),
        client_id: "nexy-cron_android_304000",
        from_app: "nexy-cron",
        app_ver: "304000",
        os: "android",
      };

      const headers = {
        Host: "nexy-cron.mobi",
        Accept: "application/json, text/plain, */*",
        "User-Agent": "okhttp/4.9.2",
      };

      const response = await axios.get(url, { params, headers });
      return response.data;
    } catch (err) {
      return null;
    }
  },

  fetchWalletBuySellActivity: async (wallet: string): Promise<any> => {
    try {
      const url = `https://nexy-cron.mobi/api/v1/wallet_activity/sol`;

      const params = {
        wallet,
        type: ["buy", "sell"],
        limit: 10,
        cost: 10,
        device_id: nanoid(16),
        client_id: "nexy-cron_android_304000",
        from_app: "nexy-cron",
        app_ver: "304000",
        os: "android",
      };

      const headers = {
        Host: "nexy-cron.mobi",
        Accept: "application/json, text/plain, */*",
        "User-Agent": "okhttp/4.9.2",
      };

      const response = await axios.get(url, { params, headers });
      return response.data;
    } catch (err) {
      return null;
    }
  },
};

export { NexyService };
