import { NexyService } from "../../services/nexy-cron/index.js";
import { WalletToolName, WalletToolArgs } from "./config.js";

export const walletToolActions: {
  [K in keyof typeof WalletToolName]: (args: WalletToolArgs[K]) => Promise<{
    name: K;
    arguments: WalletToolArgs[K];
    response?: any;
  }>;
} = {
  get_wallet_info: async (args) => {
    const response = await NexyService.fetchWalletStat7d(args.address);
    return {
      name: WalletToolName.get_wallet_info,
      arguments: args,
      response,
    };
  },

  get_token_holdings: async (args) => {
    const response = await NexyService.fetchWalletHoldings(args.address);
    return {
      name: WalletToolName.get_token_holdings,
      arguments: args,
      response,
    };
  },

  get_wallet_activity: async (args) => {
    const response = await NexyService.fetchWalletBuySellActivity(args.address);
    return {
      name: WalletToolName.get_wallet_activity,
      arguments: args,
      response,
    };
  },

  get_recent_pnl: async (args) => {
    const response = await NexyService.fetchRecentPnl(args.address);
    return {
      name: WalletToolName.get_recent_pnl,
      arguments: args,
      response,
    };
  },
};
