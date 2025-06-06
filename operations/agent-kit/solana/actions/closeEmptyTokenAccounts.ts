import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import { closeEmptyTokenAccounts } from "../tools/close_empty_token_accounts.js";

const closeEmptyTokenAccountsAction: Action = {
  name: "close_empty_token_accounts",
  similes: [
    "close token accounts",
    "remove empty accounts",
    "clean up token accounts",
    "close SPL token accounts",
    "clean wallet",
  ],
  description: `Close empty SPL Token accounts associated with your wallet to reclaim rent.
 This action will close both regular SPL Token accounts and Token-2022 accounts that have zero balance. `,
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          signature:
            "3KmPyiZvJQk8CfBVVaz8nf3c2crb6iqjQVDqNxknnusyb1FTFpXqD8zVSCBAd1X3rUcD8WiG1bdSjFbeHsmcYGXY",
          accountsClosed: 10,
        },
        explanation: "Closed 10 empty token accounts successfully.",
      },
    ],
    [
      {
        input: {},
        output: {
          status: "success",
          signature: "",
          accountsClosed: 0,
        },
        explanation: "No empty token accounts were found to close.",
      },
    ],
  ],
  schema: z.object({
    privateKey: z
      .string()
      .describe("Solana private key in base58 format (used to create agent)"),
  }),
  handler: async (agent: SolanaAgentKit) => {
    try {
      const result = await closeEmptyTokenAccounts(agent);

      if (result.size === 0) {
        return {
          status: "success",
          signature: "",
          accountsClosed: 0,
          message: "No empty token accounts found to close",
        };
      }

      return {
        status: "success",
        transaction: result.signature ?? result.signedTransaction,
        accountsClosed: result.size,
        message: `Successfully closed ${result.size} empty token accounts`,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `Failed to close empty token accounts: ${error.message}`,
      };
    }
  },
};

export default closeEmptyTokenAccountsAction;
