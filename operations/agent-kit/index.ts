import type { Plugin, SolanaAgentKit } from "solana-agent-kit";

// dexscreener
import getTokenDataAction from "./dexscreener/actions/getTokenData.js";

// jupiter
import fetchPriceAction from "./jupiter/actions/fetchPrice.js";
import tokenDataByTickerAction from "./jupiter/actions/getTokenDataByTicker.js";
import tradeAction from "./jupiter/actions/trade.js";

import launchPumpfunTokenAction from "./pumpfun/actions/launchPumpfunToken.js";
import { launchPumpFunToken } from "./pumpfun/tools/launch_pumpfun_token.js";
import rugcheckAction from "./rugcheck/actions/rugcheck.js";

// solana
import balanceAction from "./solana/actions/balance.js";
import closeEmptyTokenAccountsAction from "./solana/actions/closeEmptyTokenAccounts.js";
import getTPSAction from "./solana/actions/getTPS.js";
import tokenBalancesAction from "./solana/actions/tokenBalances.js";
import transferAction from "./solana/actions/transfer.js";
import walletAddressAction from "./solana/actions/walletAddress.js";

// Define and export the plugin
const TokenPlugin = {
  name: "token",

  // Combine all tools
  methods: {
    launchPumpFunToken,
  },

  // Combine all actions
  actions: (() => {
    const actions = [
      getTokenDataAction,
      fetchPriceAction,
      tokenDataByTickerAction,
      rugcheckAction,
      tradeAction,
      launchPumpfunTokenAction,
      balanceAction,
      tokenBalancesAction,
      getTPSAction,
      closeEmptyTokenAccountsAction,
      transferAction,
      walletAddressAction,
    ];

    return actions;
  })(),
  // Initialize function
  initialize: function (agent: SolanaAgentKit): void {
    // Initialize all methods with the agent instance
    for (const [methodName, method] of Object.entries(this.methods)) {
      if (typeof method === "function") {
        this.methods[methodName] = method.bind(null, agent);
      }
    }
  },
} satisfies Plugin;

// Default export for convenience
export default TokenPlugin;
