import { NexyService } from "../../services/nexy-cron/index.js";
import { SocialNexyService } from "../../services/social/index.js";
import { TokenToolArgs, TokenToolName } from "./config.js";

const SOL_ADDRESS = "So11111111111111111111111111111111111111112";

const tokenToolActions: {
  [K in keyof TokenToolArgs]: (args: TokenToolArgs[K]) => Promise<any>;
} = {
  get_trending_tokens: async (args) => {
    const filters = [];
    if (args.renounced) filters.push("renounced");
    if (args.frozen) filters.push("frozen");
    if (args.burn) filters.push("burn");
    if (args.distributed) filters.push("distributed");
    if (args.token_burnt) filters.push("token_burnt");

    const trendingTokens = await NexyService.fetchTrending({
      ...args,
      filters,
    } as any);

    return {
      name: TokenToolName.get_trending_tokens,
      arguments: args,
      response: {
        trending_tokens: trendingTokens,
      },
    };
  },

  get_token_info: async (args) => {
    const tokenCA =
      args.symbol?.toLowerCase() === "sol" ? SOL_ADDRESS : args.tokenCA;

    if (tokenCA) {
      const tokenDetail = await NexyService.postCoinInfo([tokenCA]);
      const social = await NexyService.fetchCoinSocial(tokenCA);

      return {
        token_detail: tokenDetail,
        social,
      };
    }

    const tokens = await NexyService.fetchSearch(args?.symbol || "");

    return {
      token_selection: tokens?.slice(0, 6),
    };
  },

  get_token_holders: async (args) => {
    if (!args.tokenCA) {
      const tokens = await NexyService.fetchSearch(args?.symbol || "");
      return {
        name: TokenToolName.get_token_holders,
        arguments: args,
        response: {
          token_selection: tokens?.slice(0, 6),
        },
      };
    }

    const holders = await NexyService.fetchHolders(args.tokenCA);
    return {
      holders: holders?.slice(0, 30),
    };
  },

  dev_check: async (args) => {
    const { tokenCA } = args;

    const tokenInfo = await NexyService.postCoinInfo([tokenCA]);
    const creatorWallet = tokenInfo?.dev?.creator_address;

    if (!creatorWallet) {
      return {
        name: TokenToolName.dev_check,
        arguments: args,
        response: {
          message: `No creator/updateAuthority found for token: ${tokenCA}`,
        },
      };
    }

    const walletBalance = await NexyService.fetchWalletStat({
      wallet: creatorWallet,
      tokenAddress: tokenCA,
    });
    const rugInfo = await NexyService.fetchRugHistory(tokenCA);

    return {
      token_info: tokenInfo,
      rug_info: rugInfo,
      wallet_balance: walletBalance,
      token_ca: tokenCA,
      creator_wallet: creatorWallet,
    };
  },

  get_tweet_creators_kol: async (args) => {
    const { tokenCA, symbol } = args;
    const search = tokenCA || symbol;
    const tokenDetail = await NexyService.postCoinInfo([search || ""]);

    const res = await SocialNexyService.topics.getTopic(
      `$${tokenDetail?.symbol}`
    );
    const posts = res?.posts;
    const creators = res?.influencers;

    const uniqueCreators = new Set(
      posts.map((p) => p?.influencer_id).filter(Boolean)
    );
    const creatorsWithPosts = creators.filter((c) =>
      uniqueCreators.has(c?.lunar_id)
    );

    return {
      creators,
      posts,
      kol_mention: uniqueCreators.size,
      top_kol_mention: creatorsWithPosts.length,
    };
  },
};

export { tokenToolActions };
