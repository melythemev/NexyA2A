import type { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import { getTokenByTicker } from "../tools/get_token_by_ticker.js";

const tokenDataByTickerAction: Action = {
  name: "get_token_data_or_info_by_ticker_or_symbol",
  similes: [
    "token data by symbol",
    "fetch token info by symbol",
    "lookup token ticker info",
    "get token info by ticker",
  ],
  description: "Get the token data for a given token ticker or symbol",
  examples: [
    [
      {
        input: {
          ticker: "USDC",
        },
        output: {
          status: "success",
          tokenData: {
            symbol: "USDC",
            name: "USD Coin",
            decimals: 6,
            mintAddress: "FhRg...",
          },
        },
        explanation: "Fetches metadata for the USDC token by its ticker.",
      },
    ],
  ],
  schema: z.object({
    ticker: z.string().min(1).describe("Ticker of the token, e.g. 'USDC'"),
  }),
  handler: async (_agent: SolanaAgentKit, input: Record<string, any>) => {
    try {
      const ticker = input.ticker as string;

      // Use agent’s method to get token data by ticker
      const tokenData = await getTokenByTicker(ticker);

      return {
        status: "success",
        tokenData: tokenData,
        message: `Successfully fetched token data for ticker: ${ticker}`,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `Failed to fetch token data for ticker: ${
          input.ticker || ""
        }. ${error.message}`,
        code: error.code || "UNKNOWN_ERROR",
      };
    }
  },
};

export default tokenDataByTickerAction;
