import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import { getWalletAddress } from "../tools/get_wallet_address.js";

const walletAddressAction: Action = {
  name: "wallet_address",
  similes: [
    "get wallet address",
    "show wallet address",
    "display wallet address",
    "my wallet address",
  ],
  description: `Get your wallet address.`,
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          message: "Wallet address retrieved successfully",
          address: "8x2dR8Mpzuz2YqyZyZjUbYWKSWesBo5jMx2Q9Y86udVk",
        },
        explanation: "Get your wallet address",
      },
    ],
  ],
  schema: z.object({
    privateKey: z
      .string()
      .describe("Solana private key in base58 format (used to create agent)"),
  }),
  handler: async (agent: SolanaAgentKit) => {
    const address = getWalletAddress(agent);
    return {
      status: "success",
      message: "Wallet address retrieved successfully",
      address,
    };
  },
};

export default walletAddressAction;
