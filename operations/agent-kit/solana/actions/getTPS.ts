import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import { getTPS } from "../tools/get_tps.js";

const getTPSAction: Action = {
  name: "get_tps",
  similes: [
    "get transactions per second",
    "check network speed",
    "network performance",
    "transaction throughput",
    "network tps",
  ],
  description:
    "Get the current transactions per second (TPS) of the Solana network",
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          tps: 3500,
          message: "Current network TPS: 3500",
        },
        explanation: "Get the current TPS of the Solana network",
      },
    ],
  ],
  schema: z.object({
    privateKey: z
      .string()
      .describe("Solana private key in base58 format (used to create agent)"),
  }), // No input parameters required
  handler: async (agent: SolanaAgentKit, _input: Record<string, any>) => {
    try {
      const response = await getTPS(agent);
      return {
        status: "success",
        response,
        message: `Current network TPS: ${response}`,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `Failed to get TPS: ${error.message}`,
      };
    }
  },
};

export default getTPSAction;
