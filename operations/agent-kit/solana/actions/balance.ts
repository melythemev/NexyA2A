import { PublicKey } from "@solana/web3.js";
import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import { get_balance } from "../tools/get_balance.js";

const balanceAction: Action = {
  name: "get_sol_balance",
  similes: [
    "check balance",
    "get wallet balance",
    "view balance",
    "show balance",
    "check token balance",
  ],
  description: `Get the balance of a Solana wallet or token account.
  If you want to get the balance of your wallet, you don't need to provide the tokenAddress.
  If no tokenAddress is provided, the balance will be in SOL.`,
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          balance: "100",
          token: "SOL",
        },
        explanation: "Get SOL balance of the wallet",
      },
    ],
    [
      {
        input: {
          tokenAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        },
        output: {
          status: "success",
          balance: "1000",
          token: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        },
        explanation: "Get USDC token balance",
      },
    ],
  ],
  schema: z.object({
    privateKey: z
      .string()
      .describe("Solana private key in base58 format (used to create agent)"),
    tokenAddress: z.string().optional(),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const balance = await get_balance(
      agent,
      input.tokenAddress && new PublicKey(input.tokenAddress)
    );

    return {
      status: "success",
      balance: balance,
      token: input.tokenAddress || "SOL",
    };
  },
};

export default balanceAction;
